#importo a biblioteca datetime
from datetime import datetime as dt
import sys

ip = sys.argv[1]
status = sys.argv[2]

#passo o caminho onde o arquivo sera criado
# como eu deixei o ponto o arquivo sera criado no diretorio em que o 
#script for executado
path = '.'


#concateno a variavel path com o nome do arquivo que sera criado
# o argumento 'a', diz que toda vez que eu executar o script sera adicionado
#uma nova linha
with open(path+'/measure.txt','a') as f:
	#adciona a mensagem com o time stemp no arquivo
	f.write(f'Alterando o status de aferição ML {dt.now()} Parâmetro: {ip} {status} \n')

