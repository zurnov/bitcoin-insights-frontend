<div align="center">
  <img src="https://github.com/user-attachments/assets/84d415af-068b-4301-84fa-e1a6015b00c9" width="200" alt="btci-logo">
  <h1>₿itcoin Insights</h1>
  <p>Explore addresses, transactions, and blocks within this Angular SPA.</p>
  <p>Powered by the BTC-I API, it provides real-time data and insights into the ₿itcoin network.</p>
</div>

## 🚀 Live Demo

[Bitcoin Insights](https://www.explore21.com)

## 📖 Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Installation](#-installation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🌟 Features

### 🏠 Home
- **Search Bar**: Search by Bitcoin wallet address, block height or block hash, and transaction ID.
- **Predefined Examples**: Buttons to generate example searches for Address, Block, and Transaction.
- **Bitcoin Blockchain Info**:
  - BTC price
  - Current block height
  - Chain info
  - Difficulty
  - Network hash rate
  - Pooled transactions
- **Latest Blocks**: View the latest blocks.
- **Latest Confirmed Transactions**: View the latest confirmed transactions.

### 💸 Donate
- **Crypto Donations**: Donate by copying the BTC or ETH address or scanning the QR code.
- **Support via Ko-fi**: Donate through Ko-fi.

### 🔍 Insights Module
- **Lazy Loading**: The Insights module is lazy-loaded to improve the application's performance by only loading the module when it's needed. This reduces the initial load time and enhances the user experience.
- **Address Info**:
  - Display wallet address hash
  - Confirmed and unconfirmed BTC balances (in BTC and USD)
  - Transaction pagination (received and sent BTC)
  - Clickable block heights and transaction IDs
- **Block Info**:
  - Detailed overview of a specific Bitcoin block
  - Paginated transactions within the block
- **Transaction Info**:
  - In-depth view of a specific Bitcoin transaction
  - Inputs and outputs with wallet addresses and amounts (in BTC and USD)

## 🛠 Technologies Used

- **Angular**
- **Tailwind CSS**: For responsive and utility-first styling.
- **ngx-clipboard**: For copying transaction IDs and addresses.
- **ngx-toastr**: For error handling and popups.
- **[Bitcoin Insights API](https://github.com/zurnov/bitcoin-insights)**: Backend API for all other Bitcoin-related data.

## ⚙ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zurnov/bitcoin-insights-frontend.git
   ```

2. Install dependencies:
    ```bash
    npm install
    ```
    
3. Serve the application:
    ```bash
    ng serve
    ```
4. Open your browser and navigate to http://localhost:4200.

Or, you can access the live deployment at [Bitcoin Insights](https://www.explore21.com).

## 📈 Usage

1. **Home Page**: Use the search bar to find Bitcoin wallet addresses, block heights, block hashes, or transaction IDs. View the latest blocks and transactions.
2. **Insights Module**: Click on addresses, blocks, or transaction IDs throughout the application to view detailed information.
3. **Donate**: Support the project by donating BTC, ETH, or through Ko-fi.

## 🚀 Deployment

The Bitcoin Insights application is deployed using Docker and involves multiple interconnected services. The server hosts the [BTC-I API](https://github.com/zurnov/bitcoin-insights). Here’s an overview of the deployment architecture:

    Bitcoin Core Service:
        Provides the core Bitcoin blockchain data and functionality.
        Directly interacts with the Bitcoin network and blockchain.

    ElectrumX Service:
        Acts as a caching layer for the Bitcoin blockchain data.
        Interfaces with the Bitcoin Core Service to retrieve and store blockchain data.

    Bitcoin Insights API:
        Serves as the backend for the Bitcoin Insights application.
        Fetches data from both the ElectrumX Service and Bitcoin Core Service.

    Bitcoin Insights Frontend:
        The Angular-based Single Page Application (SPA) that interacts with the Bitcoin Insights API to provide a rich user experience.

Data Flow:

    The frontend interacts with the Bitcoin Insights API, which fetches data from the ElectrumX and Bitcoin Core Services.
    ElectrumX caches and retrieves data from Bitcoin Core, which interacts with the Bitcoin network.

Deployment Details:

    The server setup includes Docker containers for each service, ensuring isolation and scalability.
    The deployment is optimized for performance and security to handle real-time data efficiently.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## 📸 Screenshot
<img width="1133" alt="btci" src="https://github.com/user-attachments/assets/1f1ab588-0e7f-487c-adad-63cde4379668">

