import { ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import { useStatefulApiPredictions } from "src/hooks/useFaceApiPredictions";
import { FaceApiPrediction } from "src/store/FaceApiPredictionsStore";
import { colorTheme } from "src/theme";
import styled from "styled-components";

export const AIInfo = () => {
  const predictions =
    useStatefulApiPredictions() ??
    ({
      age: 0,
      detection: { score: 0 },
      gender: "unknown",
      confidence: 0,
      expressions: {
        angry: 0,
        disgusted: 0,
        fearful: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        surprised: 0,
      },
    } as unknown as FaceApiPrediction);
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <table>
      <StyledTBody isSmall={isSmall}>
        <tr>
          <td>
            <Text color={colorTheme.yellow}>confidence</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.detection.score.toFixed(2)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text color={colorTheme.yellow}>age</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.age.toFixed(2)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text color={colorTheme.yellow}>gender</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>{predictions.gender}</Text>
          </td>
        </tr>
        <tr>
          <td>
            <br />
          </td>
          <td>
            {/* Reserves horizontal space for gender changing between male -> female -> unknown */}
            <Text style={{ opacity: 0 }}>unknown</Text>
            <br />
          </td>
        </tr>
        <tr>
          <td>
            <Text color={colorTheme.redLight}>angry</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.expressions.angry.toFixed(2)}
            </Text>
          </td>
        </tr>
        {!isSmall && (
          <>
            <tr>
              <td>
                <Text color={colorTheme.redLight}>disgusted</Text>
              </td>
              <td>
                <Text color={colorTheme.offWhite}>
                  {predictions.expressions.disgusted.toFixed(2)}
                </Text>
              </td>
            </tr>

            <tr>
              <td>
                <Text color={colorTheme.redLight}>fearful</Text>
              </td>
              <td>
                <Text color={colorTheme.offWhite}>
                  {predictions.expressions.fearful.toFixed(2)}
                </Text>
              </td>
            </tr>
          </>
        )}
        <tr>
          <td>
            <Text color={colorTheme.greenLight}>happy</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.expressions.happy.toFixed(2)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text color={colorTheme.greenLight}>neutral</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.expressions.neutral.toFixed(2)}
            </Text>
          </td>
        </tr>
        <tr>
          <td>
            <Text color={colorTheme.blueLight}>sad</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.expressions.sad.toFixed(2)}
            </Text>
          </td>
        </tr>
        {!isSmall && (
          <tr>
            <td>
              <Text color={colorTheme.blueLight}>surprised</Text>
            </td>
            <td>
              <Text color={colorTheme.offWhite}>
                {predictions.expressions.surprised.toFixed(2)}
              </Text>
            </td>
          </tr>
        )}
      </StyledTBody>
    </table>
  );
};

const StyledTBody = styled.tbody<{ isSmall: boolean }>`
  tr {
    vertical-align: top;
  }

  td:last-child {
    text-align: right;
  }

  td {
    padding: 5px 15px;
  }

  span {
    line-height: 30px;
    font-size: 20px;
    white-space: nowrap;
    user-select: none;
  }
`;
