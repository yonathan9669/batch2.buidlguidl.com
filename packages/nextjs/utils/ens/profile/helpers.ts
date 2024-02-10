import { DEFAULT_RECORD_MAP, ENSRecords, Profile, ProfileMap, SERVICES, SERVICE_REGEX, Service } from "./types.d";

// --- FUNCTIONS ---
export const loadMap = (map?: ProfileMap) => Object.assign({}, DEFAULT_RECORD_MAP, map);

export const isService = (key: string) => key.match(SERVICE_REGEX);

export function serviceUrl(service: string, value: string) {
  const url = SERVICES[service];
  return url ? url.replace("${value}", value) : value;
}

export const asService = (name: string, value: string): Service => {
  const network = name.split(".").pop() || "";
  const url = serviceUrl(network, value);

  return { name, network, url, description: network };
};

export const mapEnsRecordsToProfile = (
  { texts }: ENSRecords,
  address: string,
  projectPattern?: string,
  RecordMap?: ProfileMap,
): Profile => {
  const profile: any = { address, links: [], portfolio: [] };
  const map = loadMap(RecordMap);
  const isProject = projectPattern ? (key: string) => key.match(projectPattern) : () => false;

  texts.forEach(({ key, value }) => {
    if (key in map || isProject(key)) {
      const entry = map[key];

      switch (typeof entry) {
        case "string":
          return (profile[entry] = value);
        case "object":
          const { target, parse } = entry;
          const project = parse(value);

          if (Array.isArray(project)) profile[target] = project;
          else profile[target].push(project);

          return;
      }
    }

    if (isService(key)) profile.links.push(asService(key, value));
  });

  return profile;
};
