import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { makeVar } from '@apollo/client';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Searchbar from './Searchbar';

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

export default function AppHeader() {
    const classes = useStyles();
    const router = useRouter();

    const [name, setName] = useState('');

    const search = () => {
        router.push(`/?s=${name}`);
    }

    const onKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            search();
        }
    }

    const autoSuggest = async (_ = {}, value: string | null) => {
        const title = typeof value === 'string' ? value.trim() : '';
        setName(title);
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('s') ? params.get('s') : '';
        const query = typeof s === 'string' ? s : '';
        setName(query);
    }, [])

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
                            options={[]}
                            // options={suggestions}
                            onInputChange={(e, value) => autoSuggest(e, value)}
                            // onChange={search}
                            onKeyPress={(e) => onKeyPress(e)}
                            renderInput={(params) => (
                                <Searchbar params={params} />
                            )}
                            // getOptionLabel={(suggestion) => (suggestion.Title + suggestion.Year)}
                            value={name}
                        />
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}