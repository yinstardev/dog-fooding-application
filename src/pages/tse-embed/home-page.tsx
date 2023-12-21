import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import {
  EmbedEvent,
  HostEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
  useEmbedRef,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { startTseInitialization, tseSlice } from '@app/store/slices/tseSlice';
import './tse-embed.css';
import { BaseRow } from '../../components/common/BaseRow/BaseRow';
export function HomePage() {
  const tseState = useAppSelector((state) => state.tse);

  const dispatch = useAppDispatch();
  const embedRef = useEmbedRef();

  if (!tseState.tseInitialized) {
    dispatch(startTseInitialization());
    return <div>Tse not initialized yet</div>;
  }

  return (
    <BaseRow className="test">
      <b>Home Page</b>
      <div className="tseEmbed">
        <LiveboardEmbed
          preRenderId={tseState.supportCentralLiveboard + '-home'}
          liveboardId={tseState.supportCentralLiveboard}
          visibleVizs={[
            '07e621b5-51b9-40a1-bfee-ad99e2e66f32',
            '5de2b88e-c51e-41aa-8e28-98b58931c2a7',
            '0ff52fb5-1950-45a4-b2a0-27c1f5e888e2',
            'd13158bc-1597-4caa-8fdd-cd57f468831a',
          ]}
        />
      </div>
    </BaseRow>
  );
}
