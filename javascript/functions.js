/*Este script define a função calculate()
  chamada pelas rotinasde tratamento de eventos
  no código HTML. A função lê valores de elementos
  <input> e calcula as infirmações de pagamento de
  empréstimos, exibe o resultado em elementos <span>.
  Também salva os dados do usuário, e por fim,
  desenha um gráfico. */ 


  function calculate()
  {
        var amount = document.getElementById('amount');
        var apr = document.getElementById('apr');
        var years = document.getElementById('years');
        var zipcode = document.getElementById('zipcode');
        var payment = document.getElementById('payment');
        var total = document.getElementById('total');
        var totalinterest = document.getElementById('totalinterest');

     /*Obtém entrada do usuário através dos elementos de entrada.
        Presume que tudo isso é válido;
        Converte os juros de porcentagem para decimais,
        e converte de taxa anual para taxa mensal.
        Converte o período de pagamento em anos para
        o número de pagamentos mensais.*/
    
        var principal = parseFloat(amount.value);
        var interest = parseFloat(apr.value) / 100 / 12;
        var payments = parseFloat(payment.value) * 12;

        //agora calcula o valor do pagamento mensal.
        var x = Math.pow(1 + interest, payments);

        var monthly = (principal*x*interest)/(x-1);
        
        if (isFinite(monthly))
        {
            //Aqui, preenchemos os campos de saída, com duas casas decimais:

            payment.innerHTML = monthly.toFixed(2);
            total.innerHTML = (monthly*payments).toFixed(2);
            totalinterest.innerHTML = ((monthly*payments)-principal).toFixed(2);

            //Agora vamos salvar as entradas do usuário,
            //para que possamos recuperá-las na próxima vez que ele entrar

            save(amount.value, apr.value, years.value, zipcode.value);

            try //capturar quaisquer erros que ocorram dentro destas chaves:
            {
                getLenders(amount.value, apr.value, years.value, zipcode.value);
            }
            catch(e) {/*e ignora esses erros...*/}

            chart(principal, interest, monthly, payments);
        }
        else
        {
            /*Se o resultado for NaN ou infinito: entrada inválida! 
              Qualquer saída exibida anteriormente é apagada*/

              payment.innerHTML = "";
            total.innerHTML = "";
            totalinterest.innerHTML = "";
            chart(); //Apaga o gŕafico;
        }
  }

  //Aqui tentamos restaurar os campos de entrada quando o ducumento é carregado pela primeira vez.

  window.onload = function()
  {
    //Se o navegador suporta localStorage e temos alguns dados armazenados..
    if (window.localStorage && localStorage.loan_amount)
    {
      document.getElementById('amount').value = localStorage.loan_amount;
      document.getElementById('apr').value = localStorage.loan_apr;
      document.getElementById('years').value = localStorage.loan_years;
      document.getElementById('zipcode').value = localStorage.loan_zipcode;
    }
  };

  //Gráfico que mostra o saldo, os juros e do capital em um elemento <canvas>

  function chart(principal, interest, monthly, payments)
  {
    var graph =document.getElementById('graph');
    graph.width = graph.width; //Apagar e redefinir elemento canvas.
    
    //se caso o navegador não suportar elementos gráficos, ou se retornar sem argumentos...
    if (arguments.length == 0 || !graph.getContext) return;

    //Obtém o objeto "contexto" de <canvas> que define a API  de desenho.
    var g = graph.getContext("2d");
    var width = graph.width, height = graph.height; //Aqui obtemos o tamnho da tela de desenho;

    //Essas funções convertem números de pagamentos e valores monetários em pixels.
    function paymentToX(n){return n * width/payments;}
    function amountToY(a){return height-(a * height/(monthly*payments*1.05));}

    g.moveTo(paymentToX(0), amountToY(0)); //Começa no canto inferior esquerdo;
    g.lineTo(paymentToX(payments), amountToY(monthly*payments)); //Desenha até o canto superior direito;
    g.lineTo(paymentToX(payments), amountToY(0)); //Para baixo, até o canto inferior direito;
    g.closePath(); //E volta ao inicio;

    g.fillStyle = "#f88";
    g.fill();
    g.font = "bold 12px sans-serif";
    g.fillText(" bla bláblá");
  }