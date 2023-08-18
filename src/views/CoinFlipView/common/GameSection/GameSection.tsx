import { VStack } from "@chakra-ui/react";
import Coin from "./common/Coin";
import GameActions from "./common/GameActions";
const GameSection = () => {
  return (
    <VStack gap={7} w="full" flexDir={{ xs: "column-reverse", md: "column" }}>
      <Coin />
      <GameActions />
    </VStack>
  );
};

export default GameSection;
