import { IMediaElement } from "./IMediaElement";

export class MultipleMediaElementChain implements IMediaElement {
  addEventListener(
    event: "click" | "playing" | "pause" | "timeupdate" | "play" | "ended",
    listener: (event: Event) => void
  ) {
    const injectedListener = (event: Event) => {
      if (event.target !== this.getCurrentElement()) return;
      listener({ ...event, target: this });
    };

    // Add listener to pool so we can inject conditional
    const listeners = this.listeners.get(event) ?? new Map();
    listeners.set(listener, injectedListener);
    this.listeners.set(event, listeners);

    this.elements.forEach((element) => {
      element.addEventListener(event, injectedListener);
    });
  }
  removeEventListener(
    event: "click" | "playing" | "pause" | "timeupdate" | "play" | "ended",
    listener: (event: Event) => void
  ) {
    const injectedListener = this.listeners.get(event)?.get(listener);
    if (injectedListener === undefined) return;

    this.elements.forEach((element) => {
      element.removeEventListener(event, injectedListener);
    });
  }

  play() {
    this.getCurrentElement().play();
  }
  pause() {
    this.getCurrentElement().pause();
  }

  addProgressionHandlers() {
    this.elements.forEach((element) => {
      element.addEventListener("ended", (event) => {
        if (event.target !== this.getCurrentElement()) return;
        const maybeNextElementIndex = this.currentElementIndex + 1;
        const maxElementIndex = this.elements.length - 1;

        if (maybeNextElementIndex > maxElementIndex) return;

        this.setCurrentElementIndex(
          Math.max(maybeNextElementIndex, maxElementIndex)
        );

        this.getCurrentElement().play();
      });
    });
  }

  listeners: Map<
    "click" | "playing" | "pause" | "timeupdate" | "play" | "ended",
    Map<(event: Event) => void, (event: Event) => void>
  >;
  elements: IMediaElement[];

  currentElementIndex: number = 0;

  setCurrentElementIndex(index: number) {
    if (index === this.currentElementIndex) return;

    const isPlaying = !this.getCurrentElement().paused;
    this.elements.forEach((element, elementIndex) => {
      element.currentTime = 0;
      // All elements should be set to 0 time;
      // All elements should be paused
      if (elementIndex === index && isPlaying) {
        element.play();
      } else {
        element.pause();
      }
    });

    this.currentElementIndex = index;
  }

  constructor(elements: IMediaElement[]) {
    this.elements = elements;
    this.elements.forEach((element) => {
      // All elements should be set to 0 time;
      element.currentTime = 0;
      // All elements should be paused
      element.pause();
    });

    this.listeners = new Map();
    this.addProgressionHandlers();
  }

  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }

  get readyState(): number {
    // The result is the weakest of all the elements
    return Math.min(...this.elements.map(({ readyState }) => readyState));
  }

  get currentTime(): number {
    const elementsBeforeCurrent = this.elements.slice(
      0,
      this.currentElementIndex
    );
    const elapsedPreviously = elementsBeforeCurrent
      .map(({ duration }) => duration)
      .reduce((acc, curr) => acc + curr, 0);

    const elapsedCurrent = this.getCurrentElement().currentTime;

    return elapsedPreviously + elapsedCurrent;
  }

  set currentTime(time: number) {
    const sanitisedTime = Math.min(Math.max(0, time), this.duration);

    const durations = this.elements.map(({ duration }) => duration) as [
      number,
      ...number[]
    ];
    const accumulativeDurations = durations.reduce(
      (previousDurations, currentDuration) => {
        const previousDuration =
          previousDurations[previousDurations.length - 1] ?? 0;
        previousDurations.push(previousDuration + currentDuration);
        return previousDurations;
      },
      [] as number[]
    ) as [number, ...number[]];

    const maybeDestinationIndex = accumulativeDurations.findIndex(
      (duration) => duration > sanitisedTime
    );

    const destinationIndex = Math.max(0, maybeDestinationIndex);
    this.setCurrentElementIndex(destinationIndex);
    const elapsedPreviously = accumulativeDurations[destinationIndex - 1] ?? 0;
    if (elapsedPreviously === undefined) {
      throw new Error(
        `Could not get elapsed duration of chain with destination index ${destinationIndex} from ${accumulativeDurations}`
      );
    }
    const progressAcrossCurrentElement = sanitisedTime - elapsedPreviously;

    const currentElement = this.getCurrentElement();
    currentElement.currentTime = progressAcrossCurrentElement;
  }

  get paused(): boolean {
    return this.getCurrentElement().paused;
  }

  get ended(): boolean {
    const lastElement = this.getElementAt(this.elements.length - 1);
    return lastElement.ended;
  }

  get duration(): number {
    const sumDurations = this.elements
      .map(({ duration }) => duration)
      .reduce((acc, curr) => acc + curr, 0);

    return sumDurations;
  }

  private getElementAt(index: number) {
    const maybeElement = this.elements[index];
    if (maybeElement === undefined) {
      throw new Error(
        `Could not get media element at: ${this.setCurrentElementIndex} from elements: ${this.elements} `
      );
    }
    return maybeElement;
  }

  private getCurrentElement(): IMediaElement {
    return this.getElementAt(this.currentElementIndex);
  }
}
