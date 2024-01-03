import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { LiveboardEmbed, AppEmbed } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { startTseInitialization, tseSlice } from '@app/store/slices/tseSlice';
import './tse-embed.css';
import { BaseRow } from '../../components/common/BaseRow/BaseRow';
export function ChampagneFullApp() {
  const tseState = useAppSelector((state) => state.tse);

  const dispatch = useAppDispatch();

  if (!tseState.tseInitialized) {
    dispatch(startTseInitialization());
    return <div>Tse not initialized yet</div>;
  }

  return (
    <BaseRow className="test">
      <div className="tseEmbed">
        <AppEmbed preRenderId="full-app-embed" showPrimaryNavbar={true} />
      </div>
    </BaseRow>
  );
}
