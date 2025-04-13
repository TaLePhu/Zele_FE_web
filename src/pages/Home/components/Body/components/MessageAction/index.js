import classNames from 'classnames/bind';
import styles from './MessageAction.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { faFile, faImage } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function MessageAction() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <button className={cx('btn-action-chat')}>
                    <FontAwesomeIcon icon={faNoteSticky} />
                </button>
                <button className={cx('btn-action-chat')}>
                    <FontAwesomeIcon icon={faImage} />
                </button>
                <button className={cx('btn-action-chat')}>
                    <FontAwesomeIcon icon={faFile} />
                </button>
            </div>
        </div>
    );
}

export default MessageAction;
