import classNames from 'classnames/bind';
import styles from './MessageChat.module.scss';

const cx = classNames.bind(styles);

function MessageChat() {
    return <div className={cx('wrapper')}></div>;
}

export default MessageChat;
