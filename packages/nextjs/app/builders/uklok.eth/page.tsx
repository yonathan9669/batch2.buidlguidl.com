"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Address } from "~~/components/scaffold-eth";
import { getProfile, mapEnsRecordsToProfile } from "~~/utils/ens/profile";
import { Profile, ProfileMap } from "~~/utils/ens/profile/types";

const ADDRESS = "0xdb253953AeD478908635De50CC49C35619bcE04E";
const PROJECT_PATTERN = `eth.uklok`;
const RecordMap: ProfileMap = {
  "eth.uklok.bio": "bio",
  [PROJECT_PATTERN]: {
    target: "portfolio",
    parse: JSON.parse,
  },
};

interface UserProfileProps extends Profile {
  bio: string;
  loadedAt?: number;
}

const ONE_DAY = 1000 * 60 * 60 * 24;
const loadCache = (): UserProfileProps => JSON.parse(localStorage.getItem(PROJECT_PATTERN) || "{}");
const saveCache = (profile: UserProfileProps) => {
  profile.loadedAt = Date.now();
  localStorage.setItem(PROJECT_PATTERN, JSON.stringify(profile));
};

const Layout: React.FC = () => {
  const [profile, setProfile] = useState(loadCache());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (profile.loadedAt && profile.loadedAt > Date.now() - ONE_DAY) return setIsLoading(false);

    getProfile({ address: ADDRESS })
      .then(ensRecords => {
        const _profile = mapEnsRecordsToProfile(ensRecords, ADDRESS, PROJECT_PATTERN, RecordMap) as UserProfileProps;
        setProfile(_profile);
        setIsLoading(false);
        saveCache(_profile);
      })
      .catch(() => setError(true));
  }, []);

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
                <UserLinks profile={profile} />
              </>
            )}
          </div>
        </div>
      </div>

      <UserPortfolio loaded={!isLoading} profile={profile} />
    </>
  );
};

function UserHeader({ profile }: { profile: UserProfileProps }) {
  const { name, avatar, description, address } = profile;

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
          <code>npm i @uklok/team --member {name}</code>
        </pre>
        <pre data-prefix=">" className="text-warning">
          <code>installing...</code>
        </pre>
        <pre data-prefix=">" className="text-amber-500">
          <code>Recruiting `{name}`...</code>
        </pre>
        <pre data-prefix=">" className="text-amber-500">
          <code>👻 is now part of the crew!</code>
        </pre>
        <pre data-prefix=">" className="text-cyan-500">
          <code>{description}</code>
        </pre>
        <pre data-prefix=">" className="text-amber-500">
          <code>Suite your seat belts and enjoy the trip 🚀</code>
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

function UserLinks({ profile }: { profile: UserProfileProps }) {
  if (!profile) return;

  const { links } = profile;
  return (
    links && (
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
        {links.map(({ description, url, network }, index) => (
          <div
            key={index}
            className="px-4 py-4 max-w-xs rounded-3xl tooltip tooltip-primary tooltip-bottom"
            data-tip={description}
          >
            <SocialIcon network={network} href={url}></SocialIcon>
          </div>
        ))}
      </div>
    )
  );
}

function UserPortfolio({ loaded, profile }: { loaded: boolean; profile?: UserProfileProps }) {
  if (!profile) return;

  const { portfolio } = profile;
  return (
    loaded &&
    portfolio.length && (
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
