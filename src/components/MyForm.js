import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Paper from '@material-ui/core/Paper';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

import {
    web3Accounts,
    web3Enable,
    web3FromSource,
    web3FromAddress,
} from '@polkadot/extension-dapp';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: '50px',
        margin: 'auto',
        maxWidth: 500,
    },
    button: {
        marginRight: '20px',
    },
}));

function MyForm() {
    const classes = useStyles();
    const handleConnect = async () => {
        const extensions = await web3Enable('Socbay Dapp');
        if (extensions.length === 0) {
            // no extension installed, or the user did not accept the authorization
            // in this case we should inform the use and give a link to the extension
            return;
        }
        const allAccounts = await web3Accounts();
    };

    const handleSecond = async () => {
        const wsProvider = new WsProvider('wss://api.decloudf.com/');
        const api = await ApiPromise.create({
            provider: wsProvider,
            typesBundle: typesBundleForPolkadot,
        });

        await api.isReadyOrError;

        const allAccounts = await web3Accounts();
        const account = allAccounts[0];
        const injector = await web3FromAddress(account.address);
        api.tx.market
            .placeStorageOrder(
                // 'Qmez5P7aUpyZLzQphP9feDS1viaWyUatDBCPvkXPC8Wdqu',
                'QmWt1JFZ7gCD7Rbr6RdWmGAspE4gq5vqjS3weLArkYiDhq',
                62076,
                0.0
            )
            .signAndSend(
                account.address,
                { signer: injector.signer },
                (status) => {
                    if (status.isInBlock) {
                        console.log(
                            `Completed at block hash #${status.asInBlock.toString()}`
                        );
                    } else {
                        console.log(`Current status: ${status.type}`);
                    }
                }
            );
    };

    return (
        <Paper className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    id="standard-secondary"
                    label="Enter File CID"
                    color="secondary"
                />
            </form>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleConnect}
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                Connect to Wallet
            </Button>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSecond}
                className={classes.button}
                startIcon={<SaveIcon />}
            >
                Try an upload
            </Button>
        </Paper>
    );
}

export default MyForm;
