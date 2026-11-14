import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './PostCard.module.css';

const COLORES = ["#e57373", "#64b5f6", "#81c784", "#ffd54f", "#ba68c8", "#4db6ac", "#ff8a65", "#7986cb"];

type PostCardBaseProps = {
    id?: number | string;
    nick: string;
    createdAt: string;
    children?: ReactNode;
    actions?: ReactNode;
};

export default function PostCardBase({ id, nick, createdAt, children, actions }: PostCardBaseProps) {
    const [colorAvatar] = useState(() => COLORES[Math.floor(Math.random() * COLORES.length)]);

    return (
        <article className={styles.card}>
            <div>
                <span className={styles.avatar} style={{ backgroundColor: colorAvatar }}>
                    {nick.charAt(0).toUpperCase()}
                </span>
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
                    {id !== undefined && (
                    <Link className={styles.verMas} to={`/post/${id}`}>
                        <i className="bi bi-eye"> Ver más</i>
                    </Link>
                )}
                </footer>
            </div>
        </article>
    )
}