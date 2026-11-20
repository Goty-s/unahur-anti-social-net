import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './PostCard.module.css';
import UserIcon from './UserIcon';


type PostCardBaseProps = {
    id?: number | string;
    nick: string;
    createdAt: string;
    children?: ReactNode;
    actions?: ReactNode;
};

export default function PostCardBase({ id, nick, createdAt, children, actions }: PostCardBaseProps) {
    const { pathname } = useLocation();
    const hasId = id !== undefined;
    const isPostPage = pathname === "/post/";
    return (
        <article className={styles.card}>
            <div>
                <UserIcon nick={nick} />
            </div>

            <div className={styles.content}>
                <header className={styles.header}>
                    <span className={styles.name}>{nick}</span>
                    <span className={styles.handle}>@{nick}</span>
                    <span className={styles.date}>  • {new Date(createdAt).toLocaleDateString()}</span>
                </header>
                {children}
                <footer className={styles.footer}>
                    {actions && <div className={styles.actions}>{actions}</div>}
                    {hasId && !isPostPage && (
                        <Link className={styles.verMas} to={`/post/${id}`}>
                            <i className="bi bi-eye"> Ver más</i>
                        </Link>
                    )}
                </footer>
            </div>
        </article>
    )
}