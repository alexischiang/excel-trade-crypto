# Excel-Trade-Crypto

This project is using Office.js and React to build an Excel add-in which you can easily trade crypto with.

## How to run

1. To run the add-in, you need side-load the add-in within the Excel application. The section below describes the way of side-loading of manifest file in different platforms.

    - On Windows, follow [this tutorial](https://dev.office.com/docs/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins).

    - On macOS, move the manifest file `office-add-in-react-manifest.xml` to the folder `/Users/{username}/Library/Containers/com.microsoft.Excel/Data/Documents/wef` (if not exist, create one)

    - For Excel Online, use the upload my add-in button from the add-in command dialog to upload the manifest file. 

2. Run this in the terminal for a dev server.
    
    -  macOS & windows
    
        ```bash
        npm i
        npm start
        ```

3. Open Excel and click the Add-in to load.

## Local Backend 

Make sure you've run the backend server before you run this project.

[local backend server](https://github.com/alexischiang/excel-trade-crypto-backend).
