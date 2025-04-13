import classNames from 'classnames/bind';
import styles from './Body.module.scss';
import MessageChat from './components/MessageChat';
import MessageAction from './components/MessageAction';
import MessageInput from './components/MessageInput';

const cx = classNames.bind(styles);

function Body() {
    return (
        <div className={cx('wrapper')}>
            <MessageChat />
            <MessageAction />
            <MessageInput />
        </div>
    );
}

export default Body;
