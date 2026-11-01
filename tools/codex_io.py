"""Read and write the game data of both apps.

Character Codex: the data lives inline in Character_Codex.html as single-line `const NAME = <json>;` tables.
DM Codex: the data lives in Source/*.min.json and is built into the HTML files by Source/build.sh.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
WORKSPACE = os.path.dirname(ROOT)

# Default checkouts sit next to this repo; override with CC_REPO / DM_REPO.
CC_REPO = os.environ.get('CC_REPO', os.path.join(WORKSPACE, 'DND-Player-Tool'))
DM_REPO = os.environ.get('DM_REPO', os.path.join(WORKSPACE, 'DM-Tool'))
CC_HTML = os.path.join(CC_REPO, 'Character_Codex.html')
CC_SHEET = os.path.join(CC_REPO, 'Dnd Spreadsheet.xlsx')
DM_SRC = os.path.join(DM_REPO, 'Source')

CC_TABLES = ['SPELLS', 'CREATURE_DB', 'ITEM_DB']
DM_FILES = {'spells': 'spells.min.json', 'monsters': 'monsters.min.json', 'conditions': 'conditions.min.json',
            'items': 'items.min.json', 'cc_creatures': 'cc_creatures.min.json', 'spell_aliases': 'spell_aliases.min.json'}

norm = lambda s: re.sub(r'[^a-z0-9]', '', str(s).lower())


def _find_table(html, name):
    m = re.search(r'^const ' + re.escape(name) + r' = ', html, re.M)
    if not m:
        raise KeyError(f'{name} not found in Character_Codex.html')
    obj, end = json.JSONDecoder().raw_decode(html, m.end())
    return obj, m.end(), end


def load_cc(path=CC_HTML):
    html = open(path, encoding='utf-8').read()
    return {n: _find_table(html, n)[0] for n in CC_TABLES}


def save_cc(tables, path=CC_HTML):
    html = open(path, encoding='utf-8').read()
    for name, obj in tables.items():
        _, start, end = _find_table(html, name)
        html = html[:start] + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + html[end:]
    open(path, 'w', encoding='utf-8', newline='').write(html)


def cc_status_effects(path=CC_HTML):
    """STATUS_EFFECTS_LIB is a JS array literal ([name, text] pairs), not JSON; read it read-only."""
    html = open(path, encoding='utf-8').read()
    m = re.search(r'^const STATUS_EFFECTS_LIB = \[(.*?)^\];', html, re.M | re.S)
    pairs = re.findall(r"\[\s*(['\"])(.*?)\1\s*,\s*(['\"])(.*?)\3\s*\]", m.group(1), re.S)
    return [(a, b) for _, a, _, b in pairs]


def load_dm():
    return {k: json.load(open(os.path.join(DM_SRC, f), encoding='utf-8')) for k, f in DM_FILES.items()}


def save_dm(key, obj):
    json.dump(obj, open(os.path.join(DM_SRC, DM_FILES[key]), 'w', encoding='utf-8'),
              ensure_ascii=False, separators=(',', ':'))


def load_sheet_spells(path=CC_SHEET):
    """The original spreadsheet's Spell Data sheet (components and materials live only here for non-SRD spells)."""
    try:
        import openpyxl
    except ImportError:
        return {}
    if not os.path.exists(path):
        return {}
    wb = openpyxl.load_workbook(path, read_only=True)
    rows = list(wb['Spell Data'].iter_rows(values_only=True))
    hdr = rows[0]
    return {norm(r[0]): dict(zip(hdr, r)) for r in rows[1:] if r and r[0]}


def load_json(path):
    return json.load(open(path, encoding='utf-8'))


def dump_json(obj, path, pretty=True):
    with open(path, 'w', encoding='utf-8') as f:
        if pretty:
            json.dump(obj, f, ensure_ascii=False, indent=1)
            f.write('\n')
        else:
            json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
