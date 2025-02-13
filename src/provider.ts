// Import the fetch function from node-fetch
import fetch from 'node-fetch';
// Import the buildProviders, makeStandardFetcher, targets, getBuiltinEmbeds, and getBuiltinSources functions from the providers package
import {
  buildProviders,
  makeStandardFetcher,
  targets,
  getBuiltinEmbeds,
  getBuiltinSources,
} from '@movie-web/providers';
// Import the SourceRunnerOptions type from the providers package
import { SourceRunnerOptions } from '@movie-web/providers';

const available_sources_ids = ['ee3', 'soapertv', 'primewire', 'whvxMirrors'];

// Function to create the providers for the source runner
function makeProviders(id: string, options: SourceRunnerOptions) {
  // Create the providers using the makeBaseProviders function
  const builder = makeBaseProviders();
  // Get the builtin sources
  const sources = getBuiltinSources();
  // Add the sources to the providers
  sources.forEach((source) => {
    // Check if the source id is in the options
    if (source.id === id) {
      console.log('source.id', source.id);
    }
  });
  return builder;
}

// Function to create the base providers
function makeBaseProviders() {
  // Create the providers using the buildProviders function
  const builder = buildProviders()
    // Set the target to any
    .setTarget(targets.NATIVE)
    // Set the fetcher to the standard fetcher
    .setFetcher(makeStandardFetcher(fetch));
  // Get the builtin sources
  const sources = getBuiltinSources();
  // Add the sources to the providers
  sources.forEach((source) => builder.addSource(source));
  // Get the builtin embeds
  const embeds = getBuiltinEmbeds();
  // Add the embeds to the providers
  embeds.forEach((embed) => builder.addEmbed(embed));
  // Return the providers
  return builder;
}

// Function to scrape the source
// This function takes a source id and returns the output of the source scraper
export async function scraper(options: SourceRunnerOptions): Promise<any> {
  // Create the providers for the source runner
  const providers = makeProviders(options.id, options).build();
  // Run the source scraper
  const output = await providers.runSourceScraper({
    id: options.id,
    media: options.media,
  });
  // Return the output
  return output;
}

export function randmonSourceId() {
  return available_sources_ids[
    Math.floor(Math.random() * available_sources_ids.length)
  ];
}

export function getSources() {
  return available_sources_ids;
}
