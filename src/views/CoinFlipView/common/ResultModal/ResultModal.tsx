import {
  Box,
  Button,
  Center,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Realistic from "components/Conffeti/Realistic";
import MyModal from "components/Modal/Modal";
import useGetTransactionByHash from "hooks/useGetTransactionByHash";
import { useEffect, useState } from "react";
import {
  Base64toString,
  convertToBoolean,
  extractStringsBetweenAts,
} from "utils/functions/sc";
import { selectChoise } from "views/CoinFlipView/lib/functions";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
}

const ResultModal = ({ isOpen, onClose, txHash }: IProps) => {
  const { transaction, isLoading } = useGetTransactionByHash(txHash);
  const [userSelection, setUserSelection] = useState(false);
  const [coinSelection, setCoinSelection] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (transaction) {
      const tx = transaction;

      const flipResult = tx.results.find((result) =>
        Base64toString(result.data).startsWith("@00")
      )?.data;
      if (flipResult && tx.action.arguments.functionArgs.length === 1) {
        const gameReultsStr = Base64toString(flipResult);

        const gameReultsArr = extractStringsBetweenAts(gameReultsStr);

        const userChoiseStr = tx.action.arguments.functionArgs[0];
        const systemChoiseStr = gameReultsArr[1];

        setUserSelection(convertToBoolean(userChoiseStr));
        setCoinSelection(convertToBoolean(systemChoiseStr));

        setIsReady(true);
      }
    }
  }, [transaction]);

  const handleClose = () => {
    setIsReady(false);
    onClose();
  };

  const userWin = userSelection === coinSelection;
  return (
    <>
      {transaction && isReady && userWin && <Realistic />}
      <MyModal isOpen={isOpen} onClose={handleClose} py={0}>
        <ModalCloseButton _focus={{ border: "none" }} right={5} top={6} />
        <ModalBody pt={2} minH={"300px"}>
          {isLoading ? (
            <Center h="300px" w="full">
              <Spinner size={"lg"} />
            </Center>
          ) : (
            transaction &&
            isReady && (
              <Center width={"full"} flexDirection="column" mt={4}>
                <Box>Your Choice</Box>
                <Text
                  color="primary"
                  fontSize="xl"
                  fontWeight="semibold"
                  mb={8}
                >
                  {selectChoise(userSelection)}{" "}
                </Text>
                <Divider />
                <Box mt={8}>Coin Result</Box>
                <Text
                  color="primary"
                  fontSize="xl"
                  fontWeight="semibold"
                  mb={8}
                >
                  {selectChoise(coinSelection)}
                </Text>
                <Divider />

                {userWin ? (
                  <Text
                    color="green.500"
                    fontSize="2xl"
                    fontWeight="bold"
                    my={8}
                  >
                    You Win!
                  </Text>
                ) : (
                  <Text color="red.500" fontSize="2xl" fontWeight="bold" my={8}>
                    You Loose!
                  </Text>
                )}
              </Center>
            )
          )}
        </ModalBody>
        <ModalFooter mb={3} flexDirection="column">
          <Button
            mr={3}
            onClick={onClose}
            width="full"
            borderRadius="8px"
            height="50px"
            textTransform="uppercase"
          >
            Close
          </Button>
        </ModalFooter>
      </MyModal>
    </>
  );
};

export default ResultModal;
