import * as React from 'react';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { PageLayout } from 'tmw-main/components/PageLayout';
import Image from 'next/image';
import profilePictureHugo from 'tmw-main/assets/images/profile-picture-hugo.png';
import profilePictureJosselin from 'tmw-main/assets/images/profile-picture-josselin.png';
import profilePictureLancelot from 'tmw-main/assets/images/profile-picture-lancelot.png';

import styles from './AboutPage.module.scss';

const PROFILE_PICTURE_SIZE = 130;

export const AboutPage: React.FunctionComponent = () => {
    return (
        <PageLayout>
            <div className={styles.aboutPage}>
                <DocumentHead title="About us" />
                <div className={styles.header}>
                    <div className={styles.headerTitle}>About us</div>
                    <div className={styles.headerText}>
                        This project has been created by three french students after realizing that
                        too many people are struggling in their daily workflow, without knowing how
                        much developers have created awesome websites to help them.
                    </div>
                </div>
                <div className={styles.teamMembers}>
                    <div className={styles.teamMemberColumn}>
                        <div className={styles.profilePictureContainer}>
                            <Image
                                className={styles.profilePicture}
                                src={profilePictureHugo}
                                alt="Profile Picture"
                                width={PROFILE_PICTURE_SIZE}
                                height={PROFILE_PICTURE_SIZE}
                            />
                            <div className={styles.teamMemberName}>Hugo Jouffre</div>
                            <div className={styles.teamMemberText}>
                                I’m a business manager and graphic design student at emlyon business
                                school. I started using the Creative Adobe Suite at 17, creating
                                video content, web & graphic design for my own purpose and for
                                companies since then. I&apos;ve always been looking for new tools to
                                make my life easier and to improve my work experience and
                                efficiency.
                            </div>
                        </div>
                    </div>
                    <div className={styles.teamMemberColumn}>
                        <div className={styles.profilePictureContainer}>
                            <Image
                                className={styles.profilePicture}
                                src={profilePictureJosselin}
                                alt="Profile Picture"
                                width={PROFILE_PICTURE_SIZE}
                                height={PROFILE_PICTURE_SIZE}
                            />
                            <div className={styles.teamMemberName}>Josselin Pennors</div>
                            <div className={styles.teamMemberText}>
                                I’m a data scientist and former student from the engineering school
                                UTC. Passionate about web development during my free time, I always
                                need new resources to get better at it. I love to learn and finding
                                good resources is the key to discover and grow your knowledge fast.
                                Convinced that tipsmyweb.com would be a wonderful tool for my own
                                purpose I&apos;m glad to share it with you.
                            </div>
                        </div>
                    </div>
                    <div className={styles.teamMemberColumn}>
                        <div className={styles.profilePictureContainer}>
                            <Image
                                className={styles.profilePicture}
                                src={profilePictureLancelot}
                                alt="Profile Picture"
                                width={PROFILE_PICTURE_SIZE}
                                height={PROFILE_PICTURE_SIZE}
                            />
                            <div className={styles.teamMemberName}>Lancelot Imberton</div>
                            <div className={styles.teamMemberText}>
                                I&apos;m a web developer and a former engineering student, spending
                                my free time trying to improve my skills in various domains.
                                I&apos;ve always been amazed to see how people can build awesome
                                things when they are provided with the right set of tools, and
                                I&apos;m convinced that TipsMyWeb is the perfect solution for that.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
