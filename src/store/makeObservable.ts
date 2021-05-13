export function makeObservable<T>(target: T): Observable<T> {
  const listeners = new Set<(value: T) => void>();

  let value = target;

  const get = () => value;

  const set = (newValue: T) => {
    if (value === newValue) return;
    value = newValue;

    listeners.forEach((listener) => listener(value));
  };

  const subscribe = (onChanged: (value: T) => void) => {
    listeners.add(onChanged);
    return () => unsubscribe(onChanged);
  };

  const unsubscribe = (listenerFunc: (value: T) => void) => {
    listeners.delete(listenerFunc);
  };

  return {
    get,
    set,
    subscribe,
    listeners,
  };
}
interface Observable<T> {
  get(): T;
  set(value: T): void;
  subscribe(listener: (value: T) => void): () => void;
  readonly listeners: Set<(value: T) => void>;
}
