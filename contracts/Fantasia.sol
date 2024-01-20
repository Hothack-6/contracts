// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

contract Fantasia is
    Initializable,
    ERC1155Upgradeable,
    UUPSUpgradeable,
    AccessControlEnumerableUpgradeable
{
    using StringsUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    //###############
    //#### Roles ####
    bytes32 public constant ARTIST = keccak256("ARTIST");
    bytes32 public constant ADMIN = keccak256("ADMIN");

    //###################
    //#### Variables ####
    string private _name;
    string private _symbol;
    string private _description;

    /// @dev where the metadata will live
    string public baseUri;

    //################
    //#### ERRORS ####
    /// @dev CannotUseAddressZero calls if an address passed to a function is a zero address
    error CannotUseAddressZero();

    /// @dev InvalidTokenId throws when passing a token ID into a function that does not exist
    error InvalidTokenId();

    /// @dev AlreadyClaimed throws when an account that already owns a token tries to mint
    error AlreadyClaimed();

    //###########################
    //#### Modifiers ####
    modifier checkZeroAddress(address _walletAddress) {
        if (_walletAddress == address(0)) {
            revert CannotUseAddressZero();
        }
        _;
    }

    function initialize(
        address initialOwner,
        string memory _baseUri,
        string memory name_,
        string memory symbol_,
        string memory description_
    ) public initializer checkZeroAddress(initialOwner) {
        __ERC1155_init("");
        __UUPSUpgradeable_init();

        // Grant admin role, so other roles can be assigned
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);

        baseUri = _baseUri;
        _name = name_;
        _symbol = symbol_;
        _description = description_;
    }

    // Allows the contract owner to update the base URI if needed
    function updateBaseUri(string memory _baseUri) external onlyRole(ADMIN) {
        baseUri = _baseUri;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyRole(ADMIN) {
        uint256 balance = balanceOf(account, id);
        if (balance > 0) {
            revert AlreadyClaimed();
        }
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(ADMIN) {
        for (uint8 i = 0; i <= ids.length; i++) {
            if (balanceOf(to, ids[i]) > 0) {
                revert AlreadyClaimed();
            }
        }
        _mintBatch(to, ids, amounts, data);
    }

    // Overrides ERC1155 uri default to allow unique uri per token ID
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string.concat(baseUri, "/", tokenId.toString(), ".json");
    }

    function name() external view virtual returns (string memory) {
        return _name;
    }

    function symbol() external view virtual returns (string memory) {
        return _symbol;
    }

    function description() external view virtual returns (string memory) {
        return _description;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(ADMIN) {}

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC1155Upgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return interfaceId == type(IERC165Upgradeable).interfaceId;
    }
}
