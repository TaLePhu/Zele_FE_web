import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond, faDoorOpen, faMagnifyingGlass, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons';
import user1 from '~/assets/images/user/user1.jpg';

const cx = classNames.bind(styles);

function Header() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-info')}>
                <img src={user1} className={cx('user-image')} />
                <div className={cx('user-info__body')}>
                    <span className={cx('user-name')}>Nguyen trong phuc</span>
                    <button className={cx('user-classify')}>
                        <FontAwesomeIcon icon={faDiamond} />
                    </button>
                </div>
            </div>

            {/* header-action */}
            <div className={cx('user-action')}>
                <button className={cx('btn-action')}>
                    <FontAwesomeIcon icon={faUsers} />
                </button>
                <button className={cx('btn-action')}>
                    <FontAwesomeIcon icon={faVideo} />
                </button>
                <button className={cx('btn-action')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                <button className={cx('btn-action')}>
                    <FontAwesomeIcon icon={faDoorOpen} />
                </button>
            </div>
        </div>
    );
}

export default Header;
