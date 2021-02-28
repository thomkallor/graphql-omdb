// import { request, gql } from 'graphql-request'
import React from 'react';
import { useRouter } from 'next/router';

import { gql, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import AppHeader from '../components/AppHeader';


const getById = (imdbID: string) => {
    const query = gql(`
    {
        getById(imdbID:"${imdbID}"){
            imdbID
            Poster
            Title
            Year
            Plot
            Actors
            imdbRating
            imdbVotes
            Released
            Runtime
            Rated
            Language
            BoxOffice
            Production
            Director
            Writer
        }
    }
  `);
    return query;
};

const useStyles = makeStyles(() => ({
    margin5: {
        marginTop: '3%'
    }
}));


export default function Detail() {
    const router = useRouter();
    const classes = useStyles();
    let { imdbID } = router.query;
    imdbID = typeof imdbID === 'string' ? imdbID : '';
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const { error, loading, data } = useQuery(getById(imdbID));
    const result = data ? data.getById : {};

    if (loading) return <>{'Loading...'}</>;
    if (error) return <>{`Error! ${error.message}`}</>;
    const DynamicComponent = () => (
        <>
            <CardContent>
                <div>
                    <Typography display='inline' variant='subtitle2' >
                        {'Actors : '}
                    </Typography>
                    <Typography display='inline' variant='body2'>
                        {result.Actors}
                    </Typography>
                </div>
                <div>
                    <Typography display='inline' variant='subtitle2' >
                        {'Director : '}
                    </Typography>
                    <Typography display='inline' variant='body2'>
                        {result.Director}
                    </Typography>
                </div>
                <div>
                    <Typography display='inline' variant='subtitle2' >
                        {'Writer : '}
                    </Typography>
                    <Typography display='inline' variant='body2'>
                        {result.Writer}
                    </Typography>
                </div>
            </CardContent>
            <CardContent>
                <div>
                    <Typography display='inline' variant='subtitle2' >
                        {'Production : '}
                    </Typography>
                    <Typography display='inline' variant='body2'>
                        {result.Production ? result.Production : 'N/A'}
                    </Typography>
                </div>
                <Typography variant='subtitle2' >
                    {`Box Office Collection : ${result.BoxOffice ? result.BoxOffice : 'N/A'}`}
                </Typography>
            </CardContent>
        </>
    );

    return (
        <>
            <AppHeader />
            <Container className={classes.margin5} >
                <Card variant='outlined'>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={9} sm={6} md={4} style={{ textAlign: 'center' }} >
                                <CardContent>
                                    <img src={result.Poster}></img>
                                </CardContent>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8}>
                                <CardContent>
                                    <Typography variant='h6' >
                                        {`${result.Title} (${result.Year})`}
                                    </Typography>
                                    <Rating readOnly precision={0.25} value={result.imdbRating / 2} />
                                    <Typography variant='subtitle2' >
                                        {'Ratings : ' + result.imdbVotes}
                                    </Typography>
                                    <Typography variant='subtitle2' >
                                        {'Runtime : ' + result.Runtime}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Typography variant='h6' >
                                        Storyline :
                                </Typography>
                                    <Typography variant='body1'>
                                        {result.Plot}
                                    </Typography>
                                </CardContent>
                                {
                                    isLargeScreen ? <DynamicComponent /> : null
                                }
                            </Grid>
                            {
                                isLargeScreen ? null : <CardContent> <DynamicComponent /> </CardContent>
                            }
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};