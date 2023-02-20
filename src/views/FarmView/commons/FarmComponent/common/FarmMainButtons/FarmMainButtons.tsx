import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Center, Icon, useDisclosure } from "@chakra-ui/react";
import ActionButton from "components/ActionButton/ActionButton";
import { withdraw } from "views/FarmView/utils/services";
import StakeModal from "../Modals/StakeModal";

interface IProps {
  isOpen: boolean;
}

const FarmMainButtons = ({ isOpen }: IProps) => {
  const {
    isOpen: isOpenStake,
    onClose: onCloseStake,
    onOpen: onOpenStake,
  } = useDisclosure();

  const handleStakeLp = (e) => {
    e.stopPropagation();
    onOpenStake();
  };
  return (
    <Center gap={4} flexDir={{ xs: "column", lg: "row" }}>
      <ActionButton
        fontSize={"xs"}
        onClick={withdraw}
        w={{ xs: "full", lg: "auto" }}
      >
        Harvest
      </ActionButton>
      <ActionButton
        bg={"dark.300"}
        fontSize={"xs"}
        onClick={handleStakeLp}
        w={{ xs: "full", lg: "auto" }}
      >
        Stake LP
      </ActionButton>

      <ActionButton
        bg="transparent"
        px={0}
        display={{ xs: "none", xl: "block" }}
      >
        <Icon
          as={isOpen ? ChevronUpIcon : ChevronDownIcon}
          fontSize={"x-large"}
        />
      </ActionButton>

      {isOpenStake && (
        <StakeModal isOpen={isOpenStake} onClose={onCloseStake} />
      )}
    </Center>
  );
};

export default FarmMainButtons;
