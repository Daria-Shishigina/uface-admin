import { ListStyles } from 'components/Header/header.styles';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  CogButton,
  CogContainer,
  InputStyles,
  LabelStyles,
  SelectorContainer,
} from './clients.styles';

interface ICog {
  filtering: { name: string; property: string }[];
  setFilter: Dispatch<SetStateAction<{ property: string; name: string }[]>>;
}

const CogComponent = ({ filtering, setFilter }: ICog) => {
  const cog = useRef<HTMLDivElement | null>(null);
  const [isOpen, setOpen] = useState(false);

  const [dimensions, setDimensions] = useState<{
    x: number;
    y: number;
  }>({
    x: cog.current?.getBoundingClientRect().right || 0,
    y: cog.current?.getBoundingClientRect().bottom || 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = (): void => {
        setDimensions({
          x: cog.current?.getBoundingClientRect().right || 0,
          y: cog.current?.getBoundingClientRect().bottom || 0,
        });
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return (): void => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isOpen, dimensions]);

  return (
    <CogContainer>
      <CogButton
        className={isOpen ? 'fa-solid fa-gear active' : 'fa-solid fa-gear'}
        ref={cog}
        onClick={() => {
          setOpen(!isOpen);
          setDimensions({
            x: cog.current?.getBoundingClientRect().right || 0,
            y: cog.current?.getBoundingClientRect().bottom || 0,
          });
        }}
      ></CogButton>
      {isOpen && (
        <ListStyles
          style={{ top: dimensions.y + 5, left: dimensions.x - 190 }}
          w={190}
        >
          {filtering.map((item, i) => (
            <SelectorContainer key={i}>
              <LabelStyles>{item.name}</LabelStyles>
              <InputStyles
                type='checkbox'
                checked={item.property === '' ? true : false}
                onChange={() => {
                  const updatedList: { name: string; property: string }[] =
                    filtering.map((filt) => {
                      if (filt.name === item.name) {
                        return {
                          ...filt,
                          property:
                            filtering[i].property === '-none' ? '' : '-none',
                        };
                      }
                      return filt;
                    });
                  //@ts-ignore
                  setFilter(updatedList);
                }}
              />
            </SelectorContainer>
          ))}
        </ListStyles>
      )}
    </CogContainer>
  );
};

export default CogComponent;
