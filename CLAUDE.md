# CLAUDE.md - Instrucoes obrigatorias para o agente

Este arquivo orienta qualquer agente que va trabalhar neste repositorio.

## Regra obrigatoria de contexto

Antes de iniciar qualquer analise, correcao, refatoracao, implementacao,
documentacao ou revisao neste projeto, o agente deve obrigatoriamente ler:

1. O vault do projeto localizado na branch remota `vault`.
2. O arquivo `docs/RETOMADA_DO_PROJETO.md` (quando existir).

O vault e a memoria/documentacao viva do projeto e deve ser usado como fonte
principal de contexto historico, decisoes, backlog, lacunas conhecidas e
estado consolidado.

O arquivo `docs/RETOMADA_DO_PROJETO.md` deve ser usado como resumo operacional
mais recente para entender onde o projeto parou, o que esta pronto, o que esta
incompleto, quais comandos foram testados, quais problemas existem e quais sao
os proximos passos.

Se houver divergencia entre codigo, vault e arquivo de retomada:

- o codigo atual deve ser tratado como evidencia tecnica real;
- o vault deve ser tratado como memoria/documentacao historica e decisoria;
- a divergencia deve ser registrada antes de qualquer alteracao relevante;
- nao devem ser apagadas decisoes antigas sem justificativa.

Nenhuma tarefa substancial deve comecar sem essa leitura inicial.

> Observacao: se a branch remota `vault` ou o arquivo
> `docs/RETOMADA_DO_PROJETO.md` ainda nao existirem, registre essa ausencia
> antes de qualquer tarefa substancial. Nao invente conteudo de retomada.
