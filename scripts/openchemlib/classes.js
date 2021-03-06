'use strict';

const modified = [
  'calc/ArrayUtilsCalc',

  'chem/AbstractDrawingObject',
  'chem/DepictorTransformation',

  'chem/prediction/DruglikenessPredictor',
  'chem/prediction/IncrementTable',
  'chem/prediction/ToxicityPredictor',

  'util/ConstantsDWAR'
];

exports.modified = modified.map(getFilename);

const changed = [
  ['chem/ChemistryHelper', removePrintf],
  ['chem/io/RXNFileV3Creator', removeRXNStringFormat],
  ['chem/Molecule', changeMolecule],
  ['share/gui/editor/Model', removePrintf],
  ['util/ArrayUtils', changeArrayUtils]
];

exports.changed = changed.map((file) => {
  return [getFilename(file[0]), file[1]];
});

const removed = [
  'calc/statistics/median/ModelMedianDouble.java', // uses StringFunctions
  'chem/dnd', // ui
  'chem/FingerPrintGenerator.java',
  'chem/io/DWARFileParser.java',
  'chem/reaction/ClassificationData.java',
  'gui/dnd', // ui
  'gui/hidpi', // ui
  'share/gui/editor/chem/DrawingObject.java',
  // 'util/ArrayUtils.java', // uses reflection
  'util/CursorHelper.java',
  'util/datamodel/IntVec.java',
  'util/IntQueue.java', // unused, depends on ArrayUtils
  'util/Platform.java',
  'util/StringFunctions.java' // uses RegExp things
];

exports.removed = removed.map(getFolderName);

function getFilename(file) {
  return `actelion/research/${file}.java`;
}

function getFolderName(file) {
  return `actelion/research/${file}`;
}

function changeMolecule(molecule) {
  molecule = molecule.replace('import java.lang.reflect.Array;\n', '');
  const copyOf = 'protected final static Object copyOf';
  const copyOfIndex = molecule.indexOf(copyOf);
  if (copyOfIndex === -1) throw new Error('did not find copyOf method');
  const closeIndex = molecule.indexOf('}', copyOfIndex);
  molecule = `${molecule.substr(0, closeIndex + 1)}*/${molecule.substr(
    closeIndex + 1
  )}`;
  molecule = `${molecule.substr(0, copyOfIndex)}/*${molecule.substr(
    copyOfIndex
  )}`;
  molecule = molecule.replace(/\([^)]+\)copyOf/g, 'Arrays.copyOf');
  return molecule;
}

function removePrintf(code) {
  return code.replace(/System\.out\.printf/g, '// System.out.print');
}

function changeArrayUtils(code) {
  // eslint-disable-next-line no-tabs
  code = removeSlice(code, '\n	/**\n	 * Resize an array', 'return newArray;\n	}');
  // eslint-disable-next-line no-tabs
  code = removeSlice(code, '\n	/**\n	 * Copy an array ', 'return newArray;\n	}');
  return code;
}

function removeSlice(code, start, end) {
  const startIdx = code.indexOf(start);
  if (startIdx === -1) {
    throw new Error(`did not find index for: ${start}`);
  }
  const endIdx = code.indexOf(end, startIdx + start.length);
  if (endIdx === -1) {
    throw new Error(`did not find index for: ${end}`);
  }
  return code.substr(0, startIdx) + code.substr(endIdx + end.length);
}

function removeRXNStringFormat(code) {
  return code.replace(
    'theWriter.write(String.format("M  V30 COUNTS %d %d\\n",rcnt,pcnt));',
    'theWriter.write("M  V30 COUNTS "+rcnt+" "+pcnt+"\\n",rcnt,pcnt);'
  );
}
