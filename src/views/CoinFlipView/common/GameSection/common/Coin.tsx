import { Box, Center, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";
import CoinImg from "assets/images/logo/beskar.svg";
import { useAppSelector } from "hooks/useRedux";
import { useEffect, useRef, useState } from "react";
import { selectLastHouseSelection } from "views/CoinFlipView/lib/con-flip-slice";
import { selectChoise } from "views/CoinFlipView/lib/functions";
const Coin = () => {
  const backRef = useRef<HTMLDivElement>(null);
  const [backHeight, setBackHeight] = useState(0);
  const houseSelection = useAppSelector(selectLastHouseSelection);
  useEffect(() => {
    const handleResize = () => {
      if (backRef.current) {
        const backCoinWidth = backRef.current.offsetWidth;
        setBackHeight(backCoinWidth);
      }
    };

    // Establecer la altura inicial cuando se monta el componente
    handleResize();

    // Agregar el manejador de evento al evento de redimensionamiento
    window.addEventListener("resize", handleResize);

    // Remover el manejador de evento al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isBack = houseSelection === null ? false : !houseSelection;
  return (
    <CoinS
      w={"full"}
      h={"full"}
      p="35px"
      bg="dark.600"
      border="1px"
      borderColor="dark.300"
      borderRadius={"lg"}
      minH={"320px"}
      isBack={isBack}
    >
      <Box className="flip-card-inner" h="full" minH={"320px"}>
        <Center className="flip-card-front" h="full" minH={"320px"}>
          <Image src={CoinImg} w="265px" h="265px" />
        </Center>
        <Center className="flip-card-back">
          <Box
            maxW="265px"
            maxH="265px"
            w={"100%"}
            h={backHeight + "px"}
            bg="#005da5"
            borderRadius={"full"}
            ref={backRef}
          >
            {" "}
            <Box></Box>
          </Box>
        </Center>
      </Box>
      {houseSelection !== null && (
        <Center textAlign={"center"}>
          LAST TOSS WAS {selectChoise(houseSelection)}
        </Center>
      )}
    </CoinS>
  );
};

export default Coin;

const CoinS = styled(Box)`
  perspective: 1000px;
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .flip-card-inner {
    transform: ${(props) => (props.isBack ? "rotateY(180deg)" : "none")};
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .flip-card-back {
    transform: rotateY(180deg);
  }
`;
