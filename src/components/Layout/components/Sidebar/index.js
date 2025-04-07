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
                    <button className={cx('user-image')}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    <button className={cx('chat')}>
                        <FontAwesomeIcon icon={faComment} />
                    </button>
                    <button className={cx('contact')}>
                        <FontAwesomeIcon icon={faAddressBook} />
                    </button>
                    <button className={cx('todo')}>
                        <FontAwesomeIcon icon={faSquareCheck} />
                    </button>
                </div>

                <div className={cx('below')}>
                    <button className={cx('cloud1')}>
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                    </button>
                    <button className={cx('cloud2')}>
                        <FontAwesomeIcon icon={faCloud} />
                    </button>
                    <button className={cx('tool')}>
                        <FontAwesomeIcon icon={faToolbox} />
                    </button>
                    <button className={cx('setting')}>
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
