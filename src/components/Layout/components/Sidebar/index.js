import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faCloudArrowUp, faComment, faGear, faToolbox, faUser } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook, faSquareCheck } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

const Sidebar = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('above')}>
                    <button className={cx('user-image', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className={cx('chat', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faComment} />
                    </button>
                    <button className={cx('contact', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faAddressBook} />
                    </button>
                    <button className={cx('todo', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faSquareCheck} />
                    </button>
                </div>

                <div className={cx('below')}>
                    <button className={cx('cloud1', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                    </button>
                    <button className={cx('cloud2', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faCloud} />
                    </button>
                    <button className={cx('tool', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faToolbox} />
                    </button>
                    <button className={cx('setting', 'sidebar-icon')}>
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
