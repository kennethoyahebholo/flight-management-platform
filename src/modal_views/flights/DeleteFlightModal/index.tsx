import React from 'react';

import { useNavigate } from 'react-router-dom';

import Modal from '../../../components/Modal';
import { IDeleteFlightModal } from './DeleteFlightModal.types';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { StyledButton } from '../../../components';
import { deleteFlightDetails } from '../../../redux/slices/flights/features';
import { ERROR_OCCURRED_MESSAGE } from '../../../utils/constant';
import useToast from '../../../utils/helpers/general/useToast';
import { setRefetchGetFlightsData } from '../../../redux/slices/flights';
import CautionIcon from '../../../assets/svg_component/CautionIcon';
import { ToastType } from '../../../screens/global.types';

import DeleteFlightModalStyles from './DeleteFlightModal.module.scss';

export const handleDeleteFlight = async (
  id: string,
  dispatch: ReturnType<typeof useAppDispatch>,
  navigate: ReturnType<typeof useNavigate>,
  toast: ToastType,
  onCloseDeleteFlightModal: () => void
) => {
  const actionResult = await dispatch(deleteFlightDetails({ flightId: id }));
  if (deleteFlightDetails.fulfilled.match(actionResult)) {
    toast.success('Deleted Successfully');
    navigate('/dashboard/flights/all?page=1');
    dispatch(setRefetchGetFlightsData(true));
    onCloseDeleteFlightModal();
  } else if (deleteFlightDetails.rejected.match(actionResult)) {
    const errorMessage = actionResult.error?.message || ERROR_OCCURRED_MESSAGE;
    toast.error(errorMessage);
  }
};

const DeleteFlightModal = ({
  showDeleteFlightModal,
  onClickAwayDeleteFlightModal,
  onCloseDeleteFlightModal,
  onCancelDeleteFlightModal,
  createOrUpdateFlightApiData
}: IDeleteFlightModal) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isDeletingFlightDetails } = useAppSelector((state) => state.flights);

  return (
    <Modal
      isShow={showDeleteFlightModal}
      onClickAway={onClickAwayDeleteFlightModal}
      onClose={onCloseDeleteFlightModal}
      isShowCloseIcon={false}
      className={DeleteFlightModalStyles.DeleteFlightModal}
      isShowBottomLogo={false}>
      <div className={DeleteFlightModalStyles.DeleteFlightModal__content}>
        <div className={DeleteFlightModalStyles.DeleteFlightModal__logo}>
          <div className={DeleteFlightModalStyles.DeleteFlightModal__logoItem}>
            <CautionIcon />
          </div>
        </div>
        <h3 className={DeleteFlightModalStyles.DeleteFlightModal__headText}>Delete Flight ?</h3>

        <p className={DeleteFlightModalStyles.DeleteFlightModal__subtext}>
          Are you sure you want to delete? This action is irreversible
        </p>

        <div className={DeleteFlightModalStyles.DeleteFlightModal__bottom}>
          <StyledButton
            onClick={onCancelDeleteFlightModal}
            title="Cancel"
            className={DeleteFlightModalStyles.DeleteFlightModal__firstButton}
          />

          <StyledButton
            disabled={isDeletingFlightDetails}
            onClick={() =>
              handleDeleteFlight(
                createOrUpdateFlightApiData?.flightId as string,
                dispatch,
                navigate,
                toast,
                onCloseDeleteFlightModal
              )
            }
            title={isDeletingFlightDetails ? 'Deleting...' : 'Confirm'}
            className={DeleteFlightModalStyles.DeleteFlightModal__secondButton}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFlightModal;
