export let carroueHolder: { name: string; haveTurn: boolean } | null = null;

export const setCarroueHolder = (name: string, haveTurn: boolean) => {
  carroueHolder = { name: name.toLowerCase(), haveTurn };
};
