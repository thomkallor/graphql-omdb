// schema/Query.ts
import axios from 'axios';
import { objectType, intArg, stringArg, queryType, nullable } from 'nexus';
import { AxiosResponse } from 'axios';
import { NexusGenRootTypes } from './generated/nexus-typegen';

export const SearchResult = objectType({
  name: 'SearchResult',
  definition(t) {
    t.id('imdbID')
    t.string('Poster')
    t.string('Title')
    t.string('Type')
    t.string('Year')
  },
});

export const SearchResponse = objectType({
  name: 'SearchResponse',
  definition(t) {
    t.int('totalResults')
    t.string('Response')
    t.list.field('Search', { type: SearchResult })
  },
});

export const GetByIdResult = objectType({
  name: 'GetByIdResult',
  definition(t) {
    t.id('imdbID')
    t.string('Poster')
    t.string('Title')
    t.string('Type')
    t.string('Year')
    t.string('Rated')
    t.string('Released')
    t.string('Runtime')
    t.string('Genre')
    t.string('Director')
    t.string('Writer')
    t.string('Actors')
    t.string('Plot')
    t.string('Language')
    t.string('Country')
    t.string('Awards')
    t.string('Ratings')
    t.string('Metascore')
    t.float('imdbRating')
    t.string('imdbVotes')
    t.string('totalSeasons')
    t.string('Response')
    t.string('BoxOffice')
    t.string('Production')
  }
});

type SearchResponse = { // root type
  Response?: string | null; // String
  Search?: Array<NexusGenRootTypes['SearchResult'] | null> | null; // [SearchResult]
  totalResults?: number | null; // Int
}

export const Query = queryType({
  definition(t) {
    t.field('search', {
      type: 'SearchResponse',
      description: 'search by name',
      args: {
        name: nullable(stringArg()),
        page: nullable(intArg({ default: 1 })),
      },
      resolve: async (_, { name, page }: { name?: string | null, page?: number | null }) => {
        let results: AxiosResponse<SearchResponse>;
        if (name && name.trim()) {
          results = await axios.get(`http://www.omdbapi.com/?apikey=63e19e7a&s=${name}&page=${page}`);
        } else {
          results = await axios.get(`http://www.omdbapi.com/?apikey=63e19e7a&s=movie&page=${page}`);
        }
        return results.data;
      },
    });
    t.field('getById', {
      type: 'GetByIdResult',
      description: 'Get By Id',
      args: {
        imdbID: stringArg()
      },
      resolve: async (_, { imdbID }: { imdbID?: string | null }) => {
        const result = await axios.get(`http://www.omdbapi.com/?apikey=63e19e7a&i=${imdbID}&plot=short`);
        return result.data;
      }
    });
  },
})