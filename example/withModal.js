import React from 'react';
import { compose, withState, pure } from 'recompose';
import { withModal } from '../src/index';

const Modal = ({ onClose }) => (
  <div
    className="modal fade show"
    id="exampleModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Modal title
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">...</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
            onClick={onClose}
          >
            Close
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
);

const WithModal = ({ setModal }) => (
  <div>
    <button className="btn btn-primary" onClick={() => setModal(true)}>
      Show Modal
    </button>
  </div>
);

export default compose(
  withState('modal', 'setModal', false),
  withModal(({ modal }) => modal, Modal, ({ setModal }) => ({
    onClose: () => setModal(false)
  })),
  pure
)(WithModal);
