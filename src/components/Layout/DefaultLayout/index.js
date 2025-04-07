import Header from '../components/Header';
import Menu from './Menu';
import Sidebar from '../components/Sidebar';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('container')}>
                <div className="list-item">
                    <Header />
                    <Menu />
                </div>
            </div>
            <div className="content">{children}</div>
        </div>
    );
}

export default DefaultLayout;
