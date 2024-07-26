const ChessBoard = document.querySelector('#ChessBoard');
const DisplayTurn = document.querySelector('#DisplayTurn');
const DisplayInfo = document.querySelector('#MainContent h6');
// This variable will toggle between "White" and "Black" to unable us about which player has the current turn
let PlayerTurn = 'White';
// 

// Variable for castling
let CheckCastlingWhiteKing = true;
let CheckCastlingBlackKing = true;
// 

DisplayTurn.textContent = PlayerTurn;

// Array to define initial position of chess pieces 
const StartChessPieces = [
    BlackRook, BlackKnight, BlackBishop, BlackQueen, BlackKing, BlackBishop, BlackKnight, BlackRook,
    BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn, BlackPawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn, WhitePawn,
    WhiteRook, WhiteKnight, WhiteBishop, WhiteQueen, WhiteKing, WhiteBishop, WhiteKnight, WhiteRook,
];
// 

// A function to unable us to toggle "PlayerTurn" variable and call ReverseSquareIDs() to flip the board
function ChangePlayerTurn() {
    if (PlayerTurn == 'White') {
        PlayerTurn = 'Black';
        //Flip the board
        ReverseSquareIDs();
        // 
    }
    else {
        PlayerTurn = 'White';
        //Flip the board
        RevertSquareIDs();
        //
    }
    DisplayTurn.textContent = PlayerTurn;
}
// 

// Creating chess board. a) Adding classes made in custom CSS. b) Adding square_id attribute. c) Appending all the squares to ChessBoard. d) Assigning SVGs to all the squares throught innerHTML property. d) And so on..
function CreateChessBoard() {
    StartChessPieces.forEach((StartPiece, square_id) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('square_id', 64 - square_id);
        square_id++;
        square.innerHTML = StartPiece;
        if (square.firstChild) square.firstChild.setAttribute('draggable', true);
        const row = Math.floor((64 - square_id) / 8) + 1;
        if (row % 2 == 0) {
            if (square_id % 2 == 0) square.classList.add('periwinkle');
            else square.classList.add('white');
        }
        else {
            if (square_id % 2 == 0) square.classList.add('white');
            else square.classList.add('periwinkle');
        }
        ChessBoard.append(square);
    });
}
// 

// Flip the board to Black player side
function ReverseSquareIDs() {
    const ChessBoardSquares = document.querySelectorAll('.square');
    ChessBoardSquares.forEach((square, square_id) => {
        square.setAttribute('square_id', ++square_id);
    });
}
//

// Flip it back to White player
function RevertSquareIDs() {
    const ChessBoardSquares = document.querySelectorAll('.square');
    ChessBoardSquares.forEach((square, square_id) => {
        square.setAttribute('square_id', 64 - square_id);
        square_id++;
    });
}
// 

CreateChessBoard();

let DraggedElement = 'null';
// A variale to get the ID of dragged element
let StartingPos_ID = 'null';
// 

const AllSquares = document.querySelectorAll('#ChessBoard .square');
// Function to regularly check who won the game
function CheckWhoWon() {
    let DoesWhiteKingExist = false;
    let DoesBlackKingExist = false;
    const ChessBoardSquares = document.querySelectorAll('.square');
    ChessBoardSquares.forEach((ChessBoardSquare) => {
        if (ChessBoardSquare.firstChild) {
            if (ChessBoardSquare.firstChild.id == 'WhiteKing') {
                DoesWhiteKingExist = true;
                ChessBoardSquares.forEach((ChessBoardSquare) => {
                    if (ChessBoardSquare.firstChild) {
                        if (ChessBoardSquare.firstChild.id == 'BlackKing') DoesBlackKingExist = true;
                    }
                });
            }
        }
    });
    if (DoesWhiteKingExist && DoesBlackKingExist) return true;
    else if (!DoesWhiteKingExist) return 'Black Won The Match!';
    else return 'White Won The Match!';
}
// 

// Identifying the type of dragged chess piece to set rules for it
function IdentifyChessPiece() {
    if (DraggedElement.classList.contains(`${PlayerTurn}Pawn`)) return 'pawn';
    else if (DraggedElement.classList.contains(`${PlayerTurn}Rook`)) return 'rook';
    else if (DraggedElement.classList.contains(`${PlayerTurn}Knight`)) return 'knight';
    else if (DraggedElement.classList.contains(`${PlayerTurn}Bishop`)) return 'bishop';
    else if (DraggedElement.id == `${PlayerTurn}Queen`) return 'queen';
    else return 'king';
}
// 

// Checking if the move played with a chess piece by a player is valid or not
function CheckIfValid(TargetElm) {
    // Finding the parent element of dropped location 
    let TempElm = TargetElm;
    while (!TempElm.getAttribute('square_id')) {
        TempElm = TempElm.parentNode;
    }
    // 

    // Parsing string IDs to number IDs
    const TargetElm_ID_Num = Number(TempElm.getAttribute('square_id'));
    const StartPos_ID_Num = Number(StartingPos_ID);
    // 

    const TypeOfChessPiece = IdentifyChessPiece();
    switch (TypeOfChessPiece) {
        // Rules for "pawn" piece
        case 'pawn':
            const StartRowPawns = [9, 10, 11, 12, 13, 14, 15, 16];
            if (StartRowPawns.includes(StartPos_ID_Num) && (StartPos_ID_Num + 16 == TargetElm_ID_Num) && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 8 == TargetElm_ID_Num) && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 9 == TargetElm_ID_Num) && document.querySelector(`[square_id="${StartPos_ID_Num + 9}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 7 == TargetElm_ID_Num) && document.querySelector(`[square_id="${StartPos_ID_Num + 7}"]`).firstChild) return true;
            break;
        // 

        // Rules for "rook" piece
        case 'rook':

            //For vertical movement and checking which roof disqualified for castling
            if (StartPos_ID_Num + 8 == TargetElm_ID_Num) {
                console.log(document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook'));
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 16 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 24 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 32 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 40 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 48 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 40}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 56 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 40}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 48}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }

            if (StartPos_ID_Num - 8 == TargetElm_ID_Num) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 16 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 24 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 32 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 40 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 32}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 48 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 40}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 56 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 40}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 48}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            // 

            // For horizontal movement and checking which roof disqualified for castling
            if (StartPos_ID_Num + 1 == TargetElm_ID_Num) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 2 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 3 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 4 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 5 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 4}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 6 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 5}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num + 7 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 5}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 6}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }


            if (StartPos_ID_Num - 1 == TargetElm_ID_Num) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 2 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 3 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 4 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 5 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 4}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 6 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 5}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            if (StartPos_ID_Num - 7 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 5}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 6}"]`).firstChild) {
                if (document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.contains('WhiteRook')) {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                else {
                    document.querySelector(`[square_id = "${StartPos_ID_Num}"]`).firstChild.classList.add('NoCastlingAvailable');
                }
                return true;
            }
            break;
        //

        // 

        // Rules for "knight" movement    
        case 'knight':
            // Forward movement
            if (StartPos_ID_Num + 15 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 17 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 6 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 10 == TargetElm_ID_Num) return true;
            //

            // Backward Movement
            if (StartPos_ID_Num - 15 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 17 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 6 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 10 == TargetElm_ID_Num) return true;
            break;
        // 

        //    

        // Rules for "bishop" movement
        case 'bishop':
            // Forward diagonal movement
            if (StartPos_ID_Num + 7 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 9 == TargetElm_ID_Num) return true;
            if ((StartPos_ID_Num + 14 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 18 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 21 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 27 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 28 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 36 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 35 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 28}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 45 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 36}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 42 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 35}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 54 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 45}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 49 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 35}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 42}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 63 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 45}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 54}"]`).firstChild) return true;
            //

            // Backward diagonal movement
            if (StartPos_ID_Num - 7 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 9 == TargetElm_ID_Num) return true;
            if ((StartPos_ID_Num - 14 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 18 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 21 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 27 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 28 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 36 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 35 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 28}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 45 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 36}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 42 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 35}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 54 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 45}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 49 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 35}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 42}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 63 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 45}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 54}"]`).firstChild) return true;
            break;
        // 

        // 

        // Rules of "queen" movement
        case 'queen':
            // For vertical movement
            if (StartPos_ID_Num + 8 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 16 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild) return true;
            if (StartPos_ID_Num + 24 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild) return true;
            if (StartPos_ID_Num + 32 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild) return true;
            if (StartPos_ID_Num + 40 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild) return true;
            if (StartPos_ID_Num + 48 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 40}"]`).firstChild) return true;
            if (StartPos_ID_Num + 54 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 40}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 48}"]`).firstChild) return true;

            if (StartPos_ID_Num - 8 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 16 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild) return true;
            if (StartPos_ID_Num - 24 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild) return true;
            if (StartPos_ID_Num - 32 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild) return true;
            if (StartPos_ID_Num - 40 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 32}"]`).firstChild) return true;
            if (StartPos_ID_Num - 48 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 40}"]`).firstChild) return true;
            if (StartPos_ID_Num - 54 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 8}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 16}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 24}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 32}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 40}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 48}"]`).firstChild) return true;
            //

            // For horizontal movement
            if (StartPos_ID_Num + 1 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 2 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild) return true;
            if (StartPos_ID_Num + 3 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild) return true;
            if (StartPos_ID_Num + 4 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild) return true;
            if (StartPos_ID_Num + 5 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 4}"]`).firstChild) return true;
            if (StartPos_ID_Num + 6 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 5}"]`).firstChild) return true;
            if (StartPos_ID_Num + 7 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 5}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num + 6}"]`).firstChild) return true;

            if (StartPos_ID_Num - 1 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 2 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild) return true;
            if (StartPos_ID_Num - 3 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild) return true;
            if (StartPos_ID_Num - 4 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild) return true;
            if (StartPos_ID_Num - 5 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 4}"]`).firstChild) return true;
            if (StartPos_ID_Num - 6 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 5}"]`).firstChild) return true;
            if (StartPos_ID_Num - 7 == TargetElm_ID_Num && !document.querySelector(`[square_id="${StartPos_ID_Num - 1}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 4}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 5}"]`).firstChild && !document.querySelector(`[square_id="${StartPos_ID_Num - 6}"]`).firstChild) return true;
            //

            // Forward diagonal movement
            if (StartPos_ID_Num + 7 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num + 9 == TargetElm_ID_Num) return true;
            if ((StartPos_ID_Num + 14 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 18 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 21 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 27 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 28 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 36 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 35 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 28}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 45 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 36}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 42 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 35}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 54 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 45}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 49 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 35}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 42}"]`).firstChild) return true;
            if ((StartPos_ID_Num + 63 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 45}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 54}"]`).firstChild) return true;
            //

            // Backward diagonal movement
            if (StartPos_ID_Num - 7 == TargetElm_ID_Num) return true;
            if (StartPos_ID_Num - 9 == TargetElm_ID_Num) return true;
            if ((StartPos_ID_Num - 14 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 18 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 21 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 27 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 28 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 36 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 35 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 28}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 45 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 36}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 42 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 35}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 54 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 45}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 49 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 7}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 14}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 21}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 28}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 35}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 42}"]`).firstChild) return true;
            if ((StartPos_ID_Num - 63 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 9}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 18}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 27}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 36}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 45}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 54}"]`).firstChild) return true;
            break;
        // 

        // 

        // Rules for "king" movement
        case 'king':
            if (StartPos_ID_Num == 4 && (StartPos_ID_Num + 4 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 2}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 3}"]`).firstChild) return true;
            if (StartPos_ID_Num == 4 && (StartPos_ID_Num - 3 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 1}"]`).firstChild) return true;
            if (StartPos_ID_Num == 5 && (StartPos_ID_Num + 3 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num + 1}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num + 2}"]`).firstChild) return true;
            if (StartPos_ID_Num == 5 && (StartPos_ID_Num - 4 == TargetElm_ID_Num) && !document.querySelector(`[square_id = "${StartPos_ID_Num - 3}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 2}"]`).firstChild && !document.querySelector(`[square_id = "${StartPos_ID_Num - 1}"]`).firstChild) return true;

            if (StartPos_ID_Num + 8 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num - 8 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num + 1 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num - 1 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num + 9 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num + 7 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num - 9 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            if (StartPos_ID_Num - 7 == TargetElm_ID_Num) {
                if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false
                else CheckCastlingBlackKing = false;
                return true;
            }
            break;
        //
    }
    return false;
}
// 

// Setting DraggedElement after "dragstart" event has occurred
function dragstart(event) {
    StartingPos_ID = event.target.parentNode.getAttribute('square_id');
    DraggedElement = event.target;
}
//

// Preventing default behaivour of browser during "draover" event
function dragover(event) {
    event.preventDefault();
}
// 

function dragdrop(event) {
    event.stopPropagation();
    // Checking if the dragged element is placed outside of its initial position
    if (event.target !== DraggedElement && event.target.parentNode !== DraggedElement && event.target.parentNode.parentNode !== DraggedElement && event.target.parentNode.parentNode.parentNode !== DraggedElement && event.target.parentNode.parentNode.parentNode.parentNode !== DraggedElement) {
        // If dragged element is correct
        const CorrectDrag = DraggedElement.classList.contains(`${PlayerTurn}Piece`);
        // 

        const OpponentPlayer = PlayerTurn == 'Black' ? 'White' : 'Black';
        const OccupiedByChessPiece = (event.target.classList.contains('WhitePiece') || event.target.classList.contains('BlackPiece'));
        const OccupiedByOpponentPlayer = event.target.classList.contains(`${OpponentPlayer}Piece`);

        if (CorrectDrag) {
            // Finding the square where we dropped the piece
            let TempElm = event.target;
            while (!TempElm.getAttribute('square_id')) {
                TempElm = TempElm.parentNode;
            }
            // 

            // If dragged and dropped on your own chess piece except when it is castling
            if (OccupiedByChessPiece && !OccupiedByOpponentPlayer && !(((DraggedElement.id == 'WhiteKing') && (TempElm.firstChild?.classList.contains('WhiteRook')) && ((Number(DraggedElement.parentNode.getAttribute('square_id')) == 4 && Number(TempElm.getAttribute('square_id')) == 8) || (Number(DraggedElement.parentNode.getAttribute('square_id')) == 4 && Number(TempElm.getAttribute('square_id') == 1)))) || ((DraggedElement.id == 'BlackKing') && (TempElm.firstChild?.classList.contains('BlackRook')) && ((Number(DraggedElement.parentNode.getAttribute('square_id')) == 5 && Number(TempElm.getAttribute('square_id')) == 8) || (Number(DraggedElement.parentNode.getAttribute('square_id')) == 5 && Number(TempElm.getAttribute('square_id') == 1)))))) {
                DisplayInfo.textContent = 'Invalid move!';
                DisplayInfo.style.backgroundColor = '#f96464';
                setTimeout(() => {
                    DisplayInfo.style.backgroundColor = 'white';
                    DisplayInfo.innerHTML = `It's <span id="DisplayTurn">${PlayerTurn}</span>'s Turn!`;
                }, 2000);
            }
            //

            else {
                // Checking if move is played according to rules defined in CheckIfValid()
                if (CheckIfValid(event.target)) {
                    // Checking if castling is available. If castling is available then it totally means - CheckCastlingWhiteKing or CheckCastlingBlackKing variable is true and rook does not contains any .NoCastlingAvailable class
                    if (CheckCastlingWhiteKing && !TempElm.firstChild?.classList.contains('NoCastlingAvailable') && TempElm.getAttribute('square_id') == '8' && !(DraggedElement.classList.contains('WhiteRook') || DraggedElement.classList.contains('BlackRook'))) {
                        document.querySelector('[square_id = "5"]').append(TempElm.firstChild);
                        document.querySelector('[square_id = "6"]').append(DraggedElement);
                        if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false;
                        else CheckCastlingBlackKing = false;
                        ChangePlayerTurn();
                    }
                    else if (CheckCastlingBlackKing && !TempElm.firstChild?.classList.contains('NoCastlingAvailable') && TempElm.getAttribute('square_id') == '8' && !(DraggedElement.classList.contains('WhiteRook') || DraggedElement.classList.contains('BlackRook'))) {
                        document.querySelector('[square_id = "5"]').append(TempElm.firstChild);
                        document.querySelector('[square_id = "6"]').append(DraggedElement);
                        if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false;
                        else CheckCastlingBlackKing = false;
                        ChangePlayerTurn();
                    }
                    else if (CheckCastlingWhiteKing && !TempElm.firstChild?.classList.contains('NoCastlingAvailable') && TempElm.getAttribute('square_id') == '1' && !(DraggedElement.classList.contains('WhiteRook') || DraggedElement.classList.contains('BlackRook'))) {
                        document.querySelector('[square_id = "3"]').append(TempElm.firstChild);
                        document.querySelector('[square_id = "2"]').append(DraggedElement);
                        if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false;
                        else CheckCastlingBlackKing = false;
                        ChangePlayerTurn();
                    }
                    else if (CheckCastlingBlackKing && !TempElm.firstChild?.classList.contains('NoCastlingAvailable') && TempElm.getAttribute('square_id') == '1' && !(DraggedElement.classList.contains('WhiteRook') || DraggedElement.classList.contains('BlackRook'))) {
                        document.querySelector('[square_id = "3"]').append(TempElm.firstChild);
                        document.querySelector('[square_id = "2"]').append(DraggedElement);
                        if (DraggedElement.id == 'WhiteKing') CheckCastlingWhiteKing = false;
                        else CheckCastlingBlackKing = false;
                        ChangePlayerTurn();
                    }
                    // 

                    else {
                        // If castling isn't available
                        if (OccupiedByChessPiece && !OccupiedByOpponentPlayer) {
                            DisplayInfo.textContent = 'Invalid move!';
                            DisplayInfo.style.backgroundColor = '#f96464';
                            setTimeout(() => {
                                DisplayInfo.style.backgroundColor = 'white';
                                DisplayInfo.innerHTML = `It's <span id="DisplayTurn">${PlayerTurn}</span>'s Turn!`;
                            }, 2000);
                        }
                        // 

                        // Drag and drop performed by user is verified according to rules in CheckIsValid()
                        else {

                            // If we land draggged element on SVG element
                            if (event.target.tagName === 'svg') {
                                event.target.parentNode.parentNode.append(DraggedElement);
                                event.target.parentNode.parentNode.firstChild.remove();
                            }
                            //

                            // If we land draggged element on path element
                            else if (event.target.tagName === 'path') {
                                if (event.target.parentNode.tagName === 'g') {
                                    if (event.target.parentNode.parentNode.tagName === 'g') {
                                        event.target.parentNode.parentNode.parentNode.parentNode.parentNode.append(DraggedElement);
                                        event.target.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.remove();
                                    }
                                    else {
                                        event.target.parentNode.parentNode.parentNode.parentNode.append(DraggedElement);
                                        event.target.parentNode.parentNode.parentNode.parentNode.firstChild.remove();
                                    }
                                }
                                // Landed on pawn path
                                else {
                                    event.target.parentNode.parentNode.parentNode.append(DraggedElement);
                                    event.target.parentNode.parentNode.parentNode.firstChild.remove();
                                }
                                // 

                            }
                            // Landed on DIV which is the firstChild of a square
                            else if (!(event.target.hasAttribute('square_id'))) {
                                event.target.parentNode.append(DraggedElement);
                                event.target.parentNode.firstChild.remove();
                            }
                            // 

                            // Landed on the square itself (In case of square having no chess pieces)
                            else {
                                event.target.append(DraggedElement);
                                console.log(TempElm);
                            }
                            // If match is still on then call this function, which further calls a function for flipping board
                            ChangePlayerTurn();
                            // 
                        }
                        // 

                    }
                    // 

                    // Regularly checking who won the match
                    const CheckWhoWonVar = CheckWhoWon();
                    if (CheckWhoWonVar == 'White Won The Match!') {
                        DisplayInfo.innerHTML = CheckWhoWonVar;
                        DisplayInfo.style.backgroundColor = '#6abc6a';
                        const ChessBoardSquares = document.querySelectorAll('.square');
                        ChessBoardSquares.forEach((ChessBoardSquare) => {
                            if (ChessBoardSquare.firstChild) ChessBoardSquare.firstChild.setAttribute('draggable', false);
                        });
                    }
                    else if (CheckWhoWonVar == 'Black Won The Match!') {
                        DisplayInfo.innerHTML = CheckWhoWonVar;
                        DisplayInfo.style.backgroundColor = '#6abc6a';
                        const ChessBoardSquares = document.querySelectorAll('.square');
                        ChessBoardSquares.forEach((ChessBoardSquare) => {
                            if (ChessBoardSquare.firstChild) ChessBoardSquare.firstChild.setAttribute('draggable', false);
                        });
                    }
                    //

                }
                // 

                // If rules are voliated
                else {
                    DisplayInfo.textContent = 'Invalid move!';
                    DisplayInfo.style.backgroundColor = '#f96464';
                    setTimeout(() => {
                        DisplayInfo.style.backgroundColor = 'white';
                        DisplayInfo.innerHTML = `It's <span id="DisplayTurn">${PlayerTurn}</span>'s Turn!`;
                    }, 2000);
                }
                //

            }
        }
        // If unfortunately drag and droppped opponent piece
        else {
            DisplayInfo.textContent = 'Invalid move!';
            DisplayInfo.style.backgroundColor = '#f96464';
            setTimeout(() => {
                DisplayInfo.style.backgroundColor = 'white';
                DisplayInfo.innerHTML = `It's <span id="DisplayTurn">${PlayerTurn}</span>'s Turn!`;
            }, 2000);
        }
        //

    }
    // 

}

// Setting event handlers for all the squares ChessBoard
AllSquares.forEach((square) => {
    square.addEventListener('dragstart', dragstart);
    square.addEventListener('dragover', dragover);
    square.addEventListener('drop', dragdrop);
});
//

// Reload the whole page if anyone clicked this button
const ReloadButton = document.querySelector('#ReloadBtn');
ReloadButton.addEventListener('click', () => {
    location.reload();
});
// 

