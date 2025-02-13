import express, { Request, Response } from 'express';
import cors from 'cors';
import { randmonSourceId, scraper, getSources } from './provider.js';
import {
  SourceRunnerOptions,
  ScrapeMedia,
  getBuiltinSources,
} from '@movie-web/providers';
import {
  getMovieMediaDetails,
  getShowMediaDetails,
} from './tmdb/tmdb_utils.js';
// Import the dotenv package
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the provider service!');
});

// This is the endpoint that the consumer service will call
// provider?sourcer=whvxMirrors&type=show&tmdb_id=645&season=1&episode=1
// provider?sourcer=ee3&type=movie&tmdb_id=13
app.get('/provider', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    // Get tmdb_id from query
    const tmdb_id = req.query.tmdb_id as string;
    const type = req.query.type as string;

    if (!tmdb_id) {
      res.status(400).send({ message: 'tmdb_id is required' });
    } else if (!type || (type !== 'show' && type !== 'movie')) {
      res
        .status(400)
        .send({ message: 'type is required and must be tv or movie' });
    } else if (type === 'movie') {
      await getMovieMediaDetails(tmdb_id)
        .then((mv_info) => {
          const media = {
            type: type as 'movie',
            title: mv_info.title,
            releaseYear: mv_info.releaseYear,
            tmdbId: tmdb_id as string,
            imdbId: mv_info.imdbId,
          };
          let source = req.query.sourcer;
          if (!source) {
            source = randmonSourceId();
          }
          const ops: SourceRunnerOptions = {
            id: source as string,
            media: media as unknown as ScrapeMedia,
          };
          scraper(ops)
            .then((data) => {
              res.send(data);
            })
            .catch((error) => {
              res.status(500).send({ message: 'Internal Server Error', error });
            });
        })
        .catch((error) => {
          res.status(500).send({ message: 'Internal Server Error', error });
        });
    } else {
      const season = req.query.season as string;
      const episode = req.query.episode as string;

      await getShowMediaDetails(tmdb_id, season, episode)
        .then((mv_info) => {
          const media = {
            type: type as 'show',
            title: mv_info.title,
            releaseYear: mv_info.releaseYear,
            tmdbId: tmdb_id as string,
            imdbId: mv_info.imdbId,
            episode: {
              number: parseInt(episode),
              tmdbId: tmdb_id,
            },
            season: {
              number: parseInt(season),
              tmdbId: tmdb_id,
            },
          };
          let source = req.query.sourcer;
          if (!source) {
            source = randmonSourceId();
          }
          const ops: SourceRunnerOptions = {
            id: source as string,
            media: media as unknown as ScrapeMedia,
          };
          scraper(ops)
            .then((data) => {
              res.send(data);
            })
            .catch((error) => {
              res.status(500).send({ message: 'Internal Server Error', error });
            });
        })
        .catch((error) => {
          res.status(500).send({ message: 'Internal Server Error', error });
        });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error });
  }
});

// This is the endpoint that the consumer service will call
// sourcers, this will return all the available sources
// use first to get the first source. failed try the next.
app.get('/sourcers', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ message: getSources() });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
