import { useSharedValue } from "react-native-reanimated";

const useCardsPositionAndOffset = ({ componentWidth }) => {
  const cardAPosition = useSharedValue(0);
  const cardAPanOffset = useSharedValue(-componentWidth);

  const cardBPosition = useSharedValue(0);
  const cardBPanOffset = useSharedValue(0);

  const cardCPosition = useSharedValue(0);
  const cardCPanOffset = useSharedValue(componentWidth);

  return {
    cardAPosition,
    cardAPanOffset,

    cardBPosition,
    cardBPanOffset,

    cardCPosition,
    cardCPanOffset,
  };
};

export default useCardsPositionAndOffset;
