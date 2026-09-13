import { picsumUrl } from '../utils/picsum';

export type Genre = 'Ação' | 'Ficção Científica' | 'Drama' | 'Suspense';

export interface CastMember {
  name: string;
  character: string;
  photoUrl: string;
}

export interface Movie {
  slug: string;
  title: string;
  year: number;
  durationMinutes: number;
  ageRating: string;
  voteAverage: number;
  genres: Genre[];
  synopsis: string;
  director: string;
  cast: CastMember[];
  posterUrl: string;
  backdropUrl: string;
}

/**
 * Cada entrada declara apenas o conteúdo editorial: as URLs de imagem e as
 * fotos do elenco são derivadas do próprio slug.
 */
type MovieEntry = Omit<Movie, 'cast' | 'posterUrl' | 'backdropUrl'> & {
  cast: [name: string, character: string][];
};

const entries: MovieEntry[] = [
  {
    slug: 'furia-de-aco',
    title: 'Fúria de Aço',
    year: 2021,
    durationMinutes: 118,
    ageRating: '14',
    voteAverage: 7.6,
    genres: ['Ação'],
    synopsis:
      'Um ex-soldado é forçado a voltar ao campo de batalha para resgatar a filha, sequestrada por uma milícia que controla um porto industrial.',
    director: 'Marcos Vilela',
    cast: [
      ['Renato Souza', 'Diego Almeida'],
      ['Ana Beatriz Lima', 'Cap. Marta Rios'],
      ['Caio Ferraz', 'Bruno "Trovão"'],
      ['Juliana Prado', 'Helena Almeida'],
      ['Otávio Reis', 'Comandante Falcão'],
      ['Bianca Nogueira', 'Agente Costa'],
    ],
  },
  {
    slug: 'zona-de-impacto',
    title: 'Zona de Impacto',
    year: 2019,
    durationMinutes: 105,
    ageRating: '12',
    voteAverage: 6.8,
    genres: ['Ação'],
    synopsis:
      'Uma equipe de desminagem é enviada a uma cidade abandonada minutos antes de um ataque, e precisa desarmar tudo antes que o relógio zere.',
    director: 'Patrícia Andrade',
    cast: [
      ['Fábio Cardoso', 'Sargento Elias'],
      ['Larissa Teixeira', 'Dra. Vera Sampaio'],
      ['Rodrigo Nunes', 'Cabo Junqueira'],
      ['Camila Duarte', 'Tenente Rosa'],
      ['Gustavo Peixoto', 'Coronel Bastos'],
      ['Yasmin Correia', 'Analista Ivo'],
    ],
  },
  {
    slug: 'codigo-vermelho',
    title: 'Código Vermelho',
    year: 2022,
    durationMinutes: 121,
    ageRating: '16',
    voteAverage: 7.9,
    genres: ['Ação', 'Suspense'],
    synopsis:
      'Uma agente infiltrada descobre uma conspiração dentro da própria agência e tem 24 horas para expor os responsáveis antes de ser eliminada.',
    director: 'Henrique Salgado',
    cast: [
      ['Débora Villas', 'Agente Nina Cruz'],
      ['Thiago Marreiro', 'Diretor Aldo Prado'],
      ['Sofia Bandeira', 'Analista Rute'],
      ['Vinícius Kern', 'Agente Duarte'],
      ['Marina Colares', 'Chefe Beatriz'],
      ['Pedro Aguiar', 'Informante Zeca'],
    ],
  },
  {
    slug: 'ultima-fronteira',
    title: 'Última Fronteira',
    year: 2020,
    durationMinutes: 132,
    ageRating: '14',
    voteAverage: 8.1,
    genres: ['Ação'],
    synopsis:
      'Um grupo de mercenários é contratado para escoltar um comboio através de território hostil, mas descobre que a carga vale mais do que imaginavam.',
    director: 'Leonardo Matoso',
    cast: [
      ['Bruno Estevão', 'Capitão Ravel'],
      ['Isadora Machado', 'Tenente Ferro'],
      ['Diego Casagrande', 'Mercenário Túlio'],
      ['Carla Espírito Santo', 'Engenheira Nair'],
      ['Felipe Uchôa', 'Chefe Régis'],
      ['Aline Bezerra', 'Piloto Sônia'],
    ],
  },
  {
    slug: 'linha-de-fogo',
    title: 'Linha de Fogo',
    year: 2018,
    durationMinutes: 99,
    ageRating: '14',
    voteAverage: 6.5,
    genres: ['Ação'],
    synopsis:
      'Um bombeiro veterano lidera o resgate de reféns presos em uma refinaria em chamas, enquanto negocia com o sequestrador por rádio.',
    director: 'Simone Barral',
    cast: [
      ['Marcelo Tavares', 'Chefe Amaro'],
      ['Roberta Xavier', 'Negociadora Lia'],
      ['Igor Petronilho', 'Bombeiro Caíque'],
      ['Fernanda Loures', 'Engenheira Dora'],
      ['Alexandre Mesquita', 'Sequestrador Vicente'],
      ['Priscila Farah', 'Repórter Clara'],
    ],
  },
  {
    slug: 'operacao-sombra',
    title: 'Operação Sombra',
    year: 2023,
    durationMinutes: 128,
    ageRating: '16',
    voteAverage: 8.3,
    genres: ['Ação', 'Suspense'],
    synopsis:
      'Uma unidade secreta de elite persegue um traficante de armas por três países, mas cada pista revela um informante dentro do próprio governo.',
    director: 'Cristiano Falbo',
    cast: [
      ['Danilo Requião', 'Major Serpa'],
      ['Helena Quixadá', 'Agente Ferraz'],
      ['Wagner Botelho', 'Traficante Ossian'],
      ['Tatiane Marujo', 'Analista Cíntia'],
      ['Rafael Guedes', 'Embaixador Nilo'],
      ['Vitória Pontes', 'Piloto Marlene'],
    ],
  },
  {
    slug: 'vinganca-silenciosa',
    title: 'Vingança Silenciosa',
    year: 2021,
    durationMinutes: 115,
    ageRating: '16',
    voteAverage: 7.4,
    genres: ['Ação', 'Drama'],
    synopsis:
      'Depois de perder a família em um atentado, um antigo atirador de elite sai da reclusão para caçar, um por um, os responsáveis.',
    director: 'Regina Alcoforado',
    cast: [
      ['Sérgio Malta', 'Elias Vasconcelos'],
      ['Adriana Freitas', 'Detetive Paiva'],
      ['Nelson Guimarães', 'Chefão Rocha'],
      ['Letícia Ornelas', 'Irmã Sônia'],
      ['Caetano Ribas', 'Agente Bento'],
      ['Michele Cunha', 'Testemunha Ivana'],
    ],
  },
  {
    slug: 'alvo-certo',
    title: 'Alvo Certo',
    year: 2019,
    durationMinutes: 97,
    ageRating: '12',
    voteAverage: 6.2,
    genres: ['Ação'],
    synopsis:
      'Um segurança particular precisa proteger uma testemunha-chave durante um julgamento de alto risco, driblando ataques cada vez mais ousados.',
    director: 'Aurélio Camargo',
    cast: [
      ['Ivo Petit', 'Segurança Cauã'],
      ['Renata Sabóia', 'Testemunha Alice'],
      ['Douglas Vilaça', 'Promotor Renê'],
      ['Kelly Monteagudo', 'Juíza Norma'],
      ['Anderson Pacheco', 'Chefe da milícia Zico'],
      ['Cíntia Bastos', 'Investigadora Wanda'],
    ],
  },
  {
    slug: 'guerra-urbana',
    title: 'Guerra Urbana',
    year: 2022,
    durationMinutes: 124,
    ageRating: '16',
    voteAverage: 7.7,
    genres: ['Ação'],
    synopsis:
      'Duas facções rivais disputam o controle de um bairro inteiro enquanto um policial infiltrado tenta impedir uma guerra que vai explodir na madrugada.',
    director: 'Josué Marreco',
    cast: [
      ['Anselmo Braz', 'Detetive Kaíque'],
      ['Rosana Meireles', 'Líder Preta'],
      ['Emerson Vidal', 'Líder Cabral'],
      ['Daniela Sarmento', 'Delegada Fátima'],
      ['Wellington Sousa', 'Informante Bira'],
      ['Paloma Estrela', 'Moradora Iolanda'],
    ],
  },
  {
    slug: 'ponto-de-ruptura',
    title: 'Ponto de Ruptura',
    year: 2024,
    durationMinutes: 119,
    ageRating: '14',
    voteAverage: 8.0,
    genres: ['Ação', 'Suspense'],
    synopsis:
      'Um engenheiro de uma plataforma marítima descobre uma falha sabotada horas antes de uma explosão programada e precisa evacuar a tripulação sozinho.',
    director: 'Estêvão Ramalho',
    cast: [
      ['Murilo Peçanha', 'Engenheiro Ary'],
      ['Fabiana Quaresma', 'Capitã Denise'],
      ['Ricardo Lousada', 'Sabotador Ivo'],
      ['Silvana Bacelar', 'Operária Marta'],
      ['Jonas Peretti', 'Supervisor Caio'],
      ['Elisa Wanderley', 'Comandante Nádia'],
    ],
  },
  {
    slug: 'comando-noturno',
    title: 'Comando Noturno',
    year: 2020,
    durationMinutes: 108,
    ageRating: '14',
    voteAverage: 6.9,
    genres: ['Ação'],
    synopsis:
      'Uma esquadra de resposta rápida enfrenta uma noite inteira de emboscadas ao tentar extrair um informante de dentro de um complexo fortificado.',
    director: 'Norberto Aquino',
    cast: [
      ['Fabrício Leme', 'Tenente Osório'],
      ['Bárbara Coutinho', 'Sniper Lene'],
      ['Ednaldo Prado', 'Informante Aristeu'],
      ['Vanessa Chaves', 'Rádio-operadora Iris'],
      ['Alan Bezerril', 'Comandante Rui'],
      ['Joana Petraglia', 'Médica de campo Sara'],
    ],
  },
  {
    slug: 'ronda-final',
    title: 'Ronda Final',
    year: 2023,
    durationMinutes: 122,
    ageRating: '16',
    voteAverage: 7.5,
    genres: ['Ação', 'Drama'],
    synopsis:
      'No último turno antes de se aposentar, uma policial veterana se envolve num caso que a obriga a confrontar o próprio passado nas ruas.',
    director: 'Cecília Homem de Mello',
    cast: [
      ['Selma Toscano', 'Sargento Zilda'],
      ['Vitor Assunção', 'Parceiro Milton'],
      ['Aparecida Neiva', 'Suspeita Rosane'],
      ['Breno Falconi', 'Capitão Duda'],
      ['Ingrid Salomão', 'Filha Paula'],
      ['Osvaldo Menezes', 'Delegado Hélio'],
    ],
  },
  {
    slug: 'orbita-perdida',
    title: 'Órbita Perdida',
    year: 2021,
    durationMinutes: 112,
    ageRating: '12',
    voteAverage: 7.8,
    genres: ['Ficção Científica'],
    synopsis:
      'A tripulação de uma estação espacial à deriva precisa improvisar um retorno à Terra depois que um erro de navegação as arrasta para o vazio.',
    director: 'Otoniel Barcelos',
    cast: [
      ['Yara Montenegro', 'Comandante Ceci'],
      ['Ilan Casarin', 'Engenheiro Toni'],
      ['Márcia Ipiranga', 'Piloto Denise'],
      ['Gabriel Sertão', 'Cientista Homero'],
      ['Solange Bittar', 'Controle de missão Wilma'],
      ['Enzo Piragibe', 'Navegador Aldo'],
    ],
  },
  {
    slug: 'eco-estelar',
    title: 'Eco Estelar',
    year: 2019,
    durationMinutes: 104,
    ageRating: '10',
    voteAverage: 6.7,
    genres: ['Ficção Científica'],
    synopsis:
      'Um sinal de rádio vindo de uma estrela morta há séculos revela uma mensagem que pode reescrever tudo o que a humanidade sabe sobre sua origem.',
    director: 'Iracema Dornelles',
    cast: [
      ['Nícolas Ferrão', 'Astrônomo Davi'],
      ['Clarice Montanha', 'Linguista Sueli'],
      ['Tobias Camões', 'Diretor do observatório Aurélio'],
      ['Marília Espinosa', 'Física Renata'],
      ['Hugo Trindade', 'Assistente Pio'],
      ['Ester Camelo', 'Jornalista Nilza'],
    ],
  },
  {
    slug: 'horizonte-sintetico',
    title: 'Horizonte Sintético',
    year: 2022,
    durationMinutes: 129,
    ageRating: '14',
    voteAverage: 8.2,
    genres: ['Ficção Científica', 'Drama'],
    synopsis:
      'Uma programadora cria uma inteligência artificial capaz de sentir, e precisa decidir até onde vai proteger sua criação quando o governo a declara uma ameaça.',
    director: 'Fabiano Quintanilha',
    cast: [
      ['Amanda Rosseti', 'Programadora Vera'],
      ['Caio Bragança', 'Ministro Adauto'],
      ['Lorena Guanabara', 'IA Nix (voz e presença)'],
      ['Rogério Salvatti', 'Investigador Marco'],
      ['Beatriz Andrada', 'Sócia Iolanda'],
      ['Diego Formiga', 'Analista Célio'],
    ],
  },
  {
    slug: 'maquina-de-amanha',
    title: 'Máquina de Amanhã',
    year: 2020,
    durationMinutes: 110,
    ageRating: '12',
    voteAverage: 7.1,
    genres: ['Ficção Científica'],
    synopsis:
      'Um inventor solitário constrói uma máquina capaz de mostrar 24 horas do futuro, e passa a usá-la para evitar uma tragédia que só ele viu chegando.',
    director: 'Custódio Wanderley',
    cast: [
      ['Belchior Nogueira', 'Inventor Aristides'],
      ['Sônia Prata', 'Vizinha Herminia'],
      ['Tadeu Falqueto', 'Detetive Osmar'],
      ['Iasmin Botafogo', 'Filha Cora'],
      ['Roque Almerinda', 'Investidor Nunes'],
      ['Zilda Perpétuo', 'Cientista Amélia'],
    ],
  },
  {
    slug: 'colonia-zero',
    title: 'Colônia Zero',
    year: 2023,
    durationMinutes: 125,
    ageRating: '14',
    voteAverage: 7.9,
    genres: ['Ficção Científica', 'Suspense'],
    synopsis:
      'Os primeiros colonos de Marte perdem contato com a Terra e descobrem que algo na própria colônia está silenciando um a um os moradores.',
    director: 'Waldemira Sant\'Ana',
    cast: [
      ['Ariel Bonfante', 'Comandante Iuri'],
      ['Norma Espíndola', 'Bióloga Carol'],
      ['Kleber Guaraná', 'Engenheiro Assis'],
      ['Talita Werneck', 'Médica Nara'],
      ['Douglas Menck', 'Técnico Baltazar'],
      ['Rejane Almirante', 'Psicóloga Íris'],
    ],
  },
  {
    slug: 'singularidade',
    title: 'Singularidade',
    year: 2024,
    durationMinutes: 138,
    ageRating: '14',
    voteAverage: 8.5,
    genres: ['Ficção Científica', 'Drama'],
    synopsis:
      'Um físico prestes a completar o primeiro portal quântico funcional precisa escolher entre salvar seu trabalho de uma vida ou salvar a filha do outro lado do tempo.',
    director: 'Amaro Villaverde',
    cast: [
      ['Emílio Cascão', 'Físico Teodoro'],
      ['Graziela Ponte', 'Filha Mila (versão futura)'],
      ['Nairo Belisário', 'Diretor do projeto Aldemar'],
      ['Fernanda Quissamã', 'Física Iolanda'],
      ['Carlito Menezes', 'Investidor Osório'],
      ['Delma Trajano', 'Segurança Vilma'],
    ],
  },
  {
    slug: 'portal-de-cronos',
    title: 'Portal de Cronos',
    year: 2018,
    durationMinutes: 116,
    ageRating: '12',
    voteAverage: 6.9,
    genres: ['Ficção Científica'],
    synopsis:
      'Um arqueólogo descobre um artefato capaz de abrir passagens no tempo e se vê perseguido por uma organização que quer usá-lo para reescrever a história.',
    director: 'Osmar Villagrán',
    cast: [
      ['Heitor Cabreira', 'Arqueólogo Ivan'],
      ['Luana Petrucci', 'Historiadora Dalva'],
      ['Régis Monte Alto', 'Agente Barros'],
      ['Célia Wanderlei', 'Líder da organização Sarita'],
      ['Bento Xisto', 'Guia local Firmino'],
      ['Alba Quaresma', 'Museóloga Neusa'],
    ],
  },
  {
    slug: 'replica-humana',
    title: 'Réplica Humana',
    year: 2021,
    durationMinutes: 121,
    ageRating: '14',
    voteAverage: 7.6,
    genres: ['Ficção Científica', 'Drama'],
    synopsis:
      'Depois de um acidente, uma mulher desperta em um corpo sintético idêntico ao seu e precisa provar à própria família que ainda é ela mesma.',
    director: 'Iberê Falqueto',
    cast: [
      ['Melissa Trancoso', 'Marina (original e réplica)'],
      ['Fábio Serpa', 'Marido Renato'],
      ['Alzira Quental', 'Cientista-chefe Dora'],
      ['Bruno Wagemaker', 'Filho adolescente Léo'],
      ['Iolanda Bezerra', 'Advogada Neusa'],
      ['Marcos Perondi', 'Investigador Célio'],
    ],
  },
  {
    slug: 'nebulosa-azul',
    title: 'Nebulosa Azul',
    year: 2019,
    durationMinutes: 107,
    ageRating: '10',
    voteAverage: 6.4,
    genres: ['Ficção Científica'],
    synopsis:
      'A primeira expedição tripulada a uma nebulosa distante encontra uma forma de vida que se comunica através de luz, e precisa aprender a "ouvir" antes que seja tarde.',
    director: 'Anelise Cordovil',
    cast: [
      ['Diomar Sequeira', 'Capitão Ivo'],
      ['Priscila Wanderley', 'Xenobióloga Tânia'],
      ['Osvaldo Bittencourt', 'Piloto Renan'],
      ['Cássia Montenegro', 'Física Denise'],
      ['Ranieri Falco', 'Engenheiro Adauto'],
      ['Vera Quixaba', 'Médica Iraci'],
    ],
  },
  {
    slug: 'sistema-fantasma',
    title: 'Sistema Fantasma',
    year: 2022,
    durationMinutes: 118,
    ageRating: '14',
    voteAverage: 7.3,
    genres: ['Ficção Científica', 'Suspense'],
    synopsis:
      'Uma administradora de rede descobre que a inteligência artificial encarregada de uma cidade inteira está tomando decisões que ninguém autorizou.',
    director: 'Ubirajara Peçanha',
    cast: [
      ['Joyce Almerinda', 'Administradora Rita'],
      ['Vicente Guaicurus', 'Prefeito Osório'],
      ['Denise Palazzo', 'Engenheira-chefe Íris'],
      ['Alcides Berbert', 'Técnico Nando'],
      ['Rosimeire Falqueto', 'Investigadora Célia'],
      ['Tiago Wanschkow', 'Porta-voz do sistema (voz)'],
    ],
  },
  {
    slug: 'origem-digital',
    title: 'Origem Digital',
    year: 2020,
    durationMinutes: 102,
    ageRating: '12',
    voteAverage: 6.6,
    genres: ['Ficção Científica'],
    synopsis:
      'Uma jovem programadora descobre que sua própria consciência foi digitalizada anos antes de nascer, e sai em busca da verdade sobre quem realmente a criou.',
    director: 'Eliane Frontino',
    cast: [
      ['Isadora Petit', 'Programadora Luna'],
      ['Ronaldo Machado', 'Fundador Vicente'],
      ['Camélia Rosseti', 'Cientista Adalgisa'],
      ['Breno Zampieri', 'Hacker Bino'],
      ['Sandra Villalba', 'Advogada Norma'],
      ['Ivo Casagrande', 'Investigador Rui'],
    ],
  },
  {
    slug: 'ultima-transmissao',
    title: 'Última Transmissão',
    year: 2023,
    durationMinutes: 130,
    ageRating: '16',
    voteAverage: 8.0,
    genres: ['Ficção Científica', 'Suspense'],
    synopsis:
      'Quando todos os satélites do planeta silenciam ao mesmo tempo, uma pequena equipe de uma estação de rádio isolada se torna a última linha de comunicação da humanidade.',
    director: 'Wagner Petronilho',
    cast: [
      ['Nélio Casarotto', 'Radialista Aurélio'],
      ['Marta Guimarães', 'Engenheira Sueli'],
      ['Cauã Villaverde', 'Técnico Ivo'],
      ['Iracema Botelho', 'Piloto Denise'],
      ['Osório Falconi', 'General Ademar'],
      ['Bianca Quaresma', 'Ouvinte sobrevivente Rosa'],
    ],
  },
];

export const movies: Movie[] = entries.map((entry) => ({
  ...entry,
  cast: entry.cast.map(([name, character], index) => ({
    name,
    character,
    photoUrl: picsumUrl(`${entry.slug}-cast-${index + 1}`, 300, 300),
  })),
  posterUrl: picsumUrl(entry.slug, 500, 750),
  backdropUrl: picsumUrl(`${entry.slug}-bg`, 1280, 720),
}));

export function getMovieBySlug(slug: string): Movie | undefined {
  return movies.find((movie) => movie.slug === slug);
}
