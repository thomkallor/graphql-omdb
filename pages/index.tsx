import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';

import AppHeader from '../components/AppHeader';

const searchQuery = (name: string, page: number = 1) => {
  const query = gql(`
    {
      search(name:"${name}", page: ${page}){
        totalResults
        Search{
          imdbID
          Poster
          Title
          Year
        }
      }
    }
  `);
  return query;
};

const useStyles = makeStyles(() => ({
  toolBarContainer: {
    marginBottom: '1ch',
    marginTop: '1ch',
  },
  card: {
    height: '100%',
    width: '100%',
    opacity: 0.95,
    '&:hover': {
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.25)',
      opacity: 1
    },
    cursor: 'pointer',
  },
  cover: {
    height: '100%',
    width: '100%',
  },
  marginTop5: {
    marginTop: '5%',
  },
  margin5: {
    marginTop: '5%',
    marginBottom: '5%'
  },
  pagination: {
    marginTop: '5%',
  },
}));


export default function Home() {
  const router = useRouter();
  const { s, page } = router.query;
  const query = typeof s === 'string' ? s : '';
  const pageNum = typeof page === 'string' ? parseInt(page) : 1;
  const classes = useStyles();

  const paginate = (_ = {}, page: number = 1) => {
    router.push(`/?s=${query}&page=${page}`)
  }

  const { loading, error, data } = useQuery(
    searchQuery(
      query,
      pageNum
    )
  );

  if (loading) return <>{'Loading...'}</>;
  if (error) return <>{`Error! ${error.message}`}</>;
  const { search: { Search: results, totalResults } } = data

  return (
    <>
      <AppHeader />
      <Container>
        <Grid container justify='center' spacing={3} className={classes.marginTop5} >
          {
            results && results.length > 0 ?
              results.map((item: any) => (
                <Link
                  key={item.imdbID}
                  href={{
                    pathname: '/[imdbID]',
                    query: { imdbID: item.imdbID }
                  }}
                >
                  <Grid item xs={9} sm={4} md={3} >
                    <Paper elevation={3} className={classes.card}>
                      <img
                        src={item.Poster}
                        className={classes.cover}
                      />
                    </Paper>
                  </Grid>
                </Link>
              )) :
              'No Results Found.'
          }
        </Grid>
        <Grid container justify='center'>
          <Pagination
            className={classes.margin5}
            count={Math.ceil(totalResults / 10)}
            onChange={paginate}
            page={pageNum}
            variant="outlined"
            shape="rounded"
          />
        </Grid>
      </Container>
    </>
  )
};