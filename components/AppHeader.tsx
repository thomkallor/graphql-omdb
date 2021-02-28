import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { gql, useLazyQuery } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Searchbar from './Searchbar';

const searchQuery = gql(`
    query Search($name: String!) {
    search(name: $name) {
        Search {
        imdbID
        Title
        Year
        }
    }
    }
  `);

const useStyles = makeStyles(() => ({
    toolBarContainer: {
        marginBottom: '1ch',
        marginTop: '1ch',
    },
    pointer: {
        cursor: 'pointer'
    }
})
);
type Suggestion = {
    Title: string;
}

export default function AppHeader() {
    const classes = useStyles();
    const router = useRouter();
    const initialSuggestions: Suggestion[] = [];
    const [name, setName] = useState('');
    const [getSuggestions, { data }] = useLazyQuery(searchQuery);
    const [suggestions, setSuggestions] = useState(initialSuggestions);

    const search = (_ = {}, value: string | null) => {
        if (value) {
            router.push(`/?s=${value}`);
        }
    }

    const onKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            router.push(`/?s=${name}`);
        }
    }

    const autoSuggest = async (_ = {}, value: string | null) => {
        const title = typeof value === 'string' ? value.trim() : '';
        if (title) {
            getSuggestions(
                { variables: { name: title } },
            )
        }
        setName(title);
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('s') ? params.get('s') : '';
        const query = typeof s === 'string' ? s : '';
        setName(query);
    }, []);

    useEffect(() => {
        if (data && data.search.Search) {
            setSuggestions(data.search.Search);
        }
    }, [data]);

    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container>
                    <Grid item xs={12} sm={4} className={classes.toolBarContainer}>
                        <Link href='/' >
                            <Typography display='inline' className={classes.pointer} variant="h6" noWrap>
                                {'Rate & Review'}
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={8} className={classes.toolBarContainer}>
                        <Autocomplete
                            id="search-autocomplete"
                            freeSolo
                            selectOnFocus
                            clearOnBlur
                            options={suggestions.map(suggestion => (suggestion && suggestion.Title ? suggestion.Title : ''))}
                            onInputChange={(e, value) => autoSuggest(e, value)}
                            onChange={(e, value) => search(e, value)}
                            onKeyPress={(e) => onKeyPress(e)}
                            renderInput={(params) => (
                                <Searchbar params={params} />
                            )}
                            value={name}
                        />
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}