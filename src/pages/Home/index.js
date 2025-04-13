import Header from './components/Header';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Body from './components/Body';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('chat-view')}>
                <Body />
            </div>
        </div>
    );
}

export default Home;
