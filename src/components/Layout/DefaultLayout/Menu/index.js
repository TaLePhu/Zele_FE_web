import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu() {
    return (
        <div className={cx('wrapper')}>
            <h3>menu</h3>
        </div>
    );
}

export default Menu;
