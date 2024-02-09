"use client";

import React from "react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import useSWR from "swr";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());

const Layout: React.FC = () => {
  const { data: profile, error, isLoading } = useSWR<UserProfileProps>("/api/uklok/profile", fetcher);

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content">
          <div className="max-w-fit">
            {error && <ExclamationTriangleIcon />}
            {isLoading || !profile ? (
              <span className="loading loading-ring loading-lg"></span>
            ) : (
              <>
                <UserHeader profile={profile} />
                <UserLinks loaded={!isLoading} />
              </>
            )}
          </div>
        </div>
      </div>

      <UserPortfolio loaded={!isLoading} profile={profile} />
    </>
  );
};

type UserProfileProps = {
  bio: string;
  avatar: string;
  slogan: string;
  address: string;
  links: PlatformLink[];
  portfolio: Project[];
  loadedAt?: number;
};
function UserHeader({ profile }: { profile: UserProfileProps }) {
  const { avatar, slogan, address } = profile;

  return (
    <>
      <h1 className="text-center">
        <div className="avatar">
          <div className="w-32 mask mask-hexagon">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} width={128} height={128} alt="Avatar" />
            }
          </div>
        </div>
      </h1>

      <div className="mockup-code my-8">
        <pre data-prefix="$">
          <code>npm i @uklok/team</code>
        </pre>
        <pre data-prefix=">" className="text-warning">
          <code>installing...</code>
        </pre>
        <pre data-prefix=">" className="text-info">
          <code>{slogan}</code>
        </pre>
        <pre data-prefix=">" className="text-success">
          <code>Done!</code>
        </pre>
      </div>

      <div className="flex flex-col items-center">
        <Address address={address} size="3xl"></Address>
      </div>
    </>
  );
}

type PlatformLink = {
  name: string;
  description: string;
  url: string;
  network: string;
};
function UserLinks({ loaded }: { loaded: boolean }) {
  const { data, error, isLoading } = useSWR<PlatformLink[]>("/api/uklok/links", fetcher);

  if (error) return;

  const links = data || [];
  return (
    loaded && (
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
        {isLoading ? (
          <span className="loading loading-dots loading-md"></span>
        ) : (
          links.map(({ description, url, network }, index) => (
            <div
              key={index}
              className="px-4 py-4 max-w-xs rounded-3xl tooltip tooltip-primary tooltip-bottom"
              data-tip={description}
            >
              <SocialIcon network={network} href={url}></SocialIcon>
            </div>
          ))
        )}
      </div>
    )
  );
}

type Project = {
  title: string;
  description: string;
  image: string;
  link: string;
};
function UserPortfolio({ loaded, profile }: { loaded: boolean; profile?: UserProfileProps }) {
  const { data, error, isLoading } = useSWR<Project[]>("/api/uklok/projects", fetcher);

  if (error || !profile) return;

  const portfolio = data || [];
  return (
    loaded &&
    !isLoading && (
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <h1 className="text-center font-extrabold text-xl">Portfolio</h1>
          <p className="text-center my-8 text-lg font-serif">{profile.bio}</p>

          {portfolio.map(({ title, image, description, link }, index) => (
            <div key={index} className="card w-96 glass">
              <figure>
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt={`${title} | image`} width={300} height={300} />
                }
              </figure>
              <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <div className="card-actions justify-end">
                  <Link href={link}>
                    <button className="btn btn-primary">More Details?</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default Layout;
