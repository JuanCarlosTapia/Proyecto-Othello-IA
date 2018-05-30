var methods = {};


// Funcion que revisa si un movimiento es valido
function revisarValido (x,y,jugador, board)
{
    var x_inf = x > 0 ? x - 1 : 0;
    var y_inf = y > 0 ? y - 1 : 0;
    var x_sup = x < 7 ? x + 1 : 7;
    var y_sup = y < 7 ? y + 1 : 7;

    var valido = false;
    if (board[x][y])
        return false;
    for (xi = x_inf; xi <= x_sup; xi++) {
        for (yi = y_inf; yi <= y_sup; yi++) {
            if (xi == x && yi == y)
                continue;
            var vecino = board[xi][yi];
            if (vecino != 0 && vecino != jugador) {
                var x_diag = xi - x;
                var y_diag = yi - y;
                    //alert (x_diag +" "+ y_diag);
                for (z=1;;z++) {
                    var x_prueba = x+z*x_diag;
                    var y_prueba = y+z*y_diag;
                    //alert ("probing "+z+" "+x_prueba +" "+ y_prueba);
                    if (x_prueba < 0 || y_prueba < 0 ||
                        x_prueba > 7 || y_prueba > 7)
                        break;
                    if (board[x_prueba][y_prueba] == 0)
                        break;
                    if (board[x_prueba][y_prueba] == jugador) {
                        valido = true;
                        
                        break;
                    }
                }
            }
        }
    }
    return valido;
}

// Funcion que devuelve como queda el tablero tras el movimiento.
methods.newBoardAfterMove = function (x,y,jugador, board)
{
    var x_inf = x > 0 ? x - 1 : 0;
    var y_inf = y > 0 ? y - 1 : 0;
    var x_sup = x < 7 ? x + 1 : 7;
    var y_sup = y < 7 ? y + 1 : 7;
    var valido = false;
    if (board[x][y])
        return board;
    for (xi = x_inf; xi <= x_sup; xi++) {
        for (yi = y_inf; yi <= y_sup; yi++) {
            if (xi == x && yi == y)
                continue;
            var vecino = board[xi][yi];
            if (vecino != 0 && vecino != jugador) {
                var x_diag = xi - x;
                var y_diag = yi - y;

                for (z=1;;z++) {
                    var x_prueba = x+z*x_diag;
                    var y_prueba = y+z*y_diag;
                    if (x_prueba < 0 || y_prueba < 0 ||
                        x_prueba > 7 || y_prueba > 7)
                        break;
                    if (board[x_prueba][y_prueba] == 0)
                        break;
                    if (board[x_prueba][y_prueba] == jugador) {  
                            // Como el tiro es valido entonces se realiza la modificacion
                            for (s=0; s < z; s++) {
                                var x_modificar = x+s*x_diag;
                                var y_modificar = y+s*y_diag;
                                board[x_modificar][y_modificar] = jugador;
                            }
                            return board;
                        
                        break;
                    }
                }
            }
        }
    }
    return board;
}



// Funcion que revisa todas las posiciones del tablero y devuelve las que son validas para el jugador.
methods.validosAll = function (jugador, board)
{
    var tirosValidos = [];
    var cont = 0 ; 
    for (x=0;x<8;x++) {
        for (y=0;y<8;y++) {
            var valido_p =  revisarValido (x,y,jugador, board);
            if (valido_p) {
                var tiro = [];
                tiro.push(x);
                tiro.push(y);
                tirosValidos.push(tiro);
            
                cont += 1;
            }
        }
    }
    return tirosValidos;
}


// Funcion que devuelve el ID del otro jugaddor.
methods.otherPlayer = function(jugador) {
  if (jugador == 1) {
    return 2;
  } else {
    return 1;
  }
}

exports.data = methods;
