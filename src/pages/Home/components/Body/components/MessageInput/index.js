import classNames from 'classnames/bind';
import styles from './MessageInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function MessageInput() {
    return (
        <div className={cx('wrapper')}>
            <input type="text" placeholder="Nhập @ tin nhắn tới ... " className={cx('form-control')} />

            <div className={cx('input-action')}>
                <button className={cx('btn-input')}>
                    <FontAwesomeIcon icon={faFaceSmile} />
                </button>
                <button className={cx('btn-input')}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}

export default MessageInput;
