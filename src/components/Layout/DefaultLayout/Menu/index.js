import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import data from '~/fakedata';

const cx = classNames.bind(styles);

function Menu() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <ul className={cx('list-chat')}>
                    {data.map((item) => (
                        <li className={cx('chat-item')}>
                            <img src={item.imageURL} className={cx('chat-item__img')} alt="img-user" />
                            <div className={cx('chat-item__body')}>
                                <span className={cx('chat-item__name')}>{item.name}</span>
                                <span className={cx('chat-item__desc')}>{item.desc}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Menu;
