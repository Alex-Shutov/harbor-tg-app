import React, { useMemo } from 'react';
import {ContentObject} from "../../selection.types.ts";
import './block.scss'
import Button from "../../../../shared/Button";
import {Link} from "react-router-dom";
import { EPageType } from '@shared/constants';
import { ContentBlockTopBanner } from './ContentBlockTopBanner';
interface IProps{
    contentBlock: ContentObject
}
const Index:React.FC<IProps> = ({contentBlock}) => {
    const idToNavigate = contentBlock.id

    const pageTypeToNavigate = useMemo(() => {
        if (contentBlock.type === "FOOD_ESTABLISHMENT"){
            return "establishment"
        }
        else if (contentBlock.type === "LEISURE"){
            return "leisure"
        }
        else return "events"
    },[contentBlock])

    const pageType = useMemo(() => {
        if (contentBlock.type === "FOOD_ESTABLISHMENT") {
            return EPageType.ESTABLISHMENT;
        } else if (contentBlock.type === "LEISURE") {
            return EPageType.LEISURE;
        } else {
            return EPageType.EVENT;
        }
    }, [contentBlock]);

    return (
      <div>
          <div className={'selection_block'}>
              <ContentBlockTopBanner contentBlock={contentBlock} pageType={pageType} />
              <div className={'description'}>{contentBlock.description}</div>
              <div className={'button-container'}>
                  <Link to={`/${pageTypeToNavigate}/${idToNavigate}`}>
                      <Button type={'secondary'}>Подробнее</Button>
                  </Link>
              </div>
          </div>
      </div>
    );
};

export default Index;