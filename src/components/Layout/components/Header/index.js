import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faEllipsis, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('above')}>
                    <input type="text" placeholder="tim kiem..." className={cx('header-input')} />
                    <button className={cx('btn-search')}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                </div>
                {/* header-below */}
                <div className={cx('below')}>
                    <div className={cx('below-left')}>
                        <span className={cx('below-left__text')}>Tất cả</span>
                        <span className={cx('below-left__text')}>Chưa đọc</span>
                    </div>
                    <div className={cx('below-right')}>
                        <button className={cx('btn__phan-loai')}>
                            <span className={cx('below-right__btn-text')}>Phân loại</span>
                            <FontAwesomeIcon icon={faArrowDown} />
                        </button>
                        <button className={cx('btn__ba-cham')}>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
