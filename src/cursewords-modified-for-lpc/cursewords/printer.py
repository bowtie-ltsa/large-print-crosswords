import math
import sys
import textwrap

def printer_output_json(grid, path_to_filename, style=None, width=None, downs_only=False):
    filename = path_to_filename.split('/')[-1].split('.')[0]
    print(f'{{')
    print(f'  "title": `{grid.title} • {grid.author} • {filename}`,')

    print(f'  "clues": `')

    if not downs_only:
        print('<div class="clue clue-across"><span class="direction">ACROSS</span></div>')
        for entry in grid.clues['across']:
            print(f'<div class="clue clue-across"><span class="num">{entry["num"]}</span> <span class="clue-text">{entry["clue"].strip()}</span></div>')

    print('<div class="clue clue-down"><span class="direction">DOWN</span></div>')
    for entry in grid.clues['down']:
        print(f'<div class="clue clue-down"><span class="num">{entry["num"]}</span> <span class="clue-text">{entry["clue"].strip()}</span></div>')

    print(f'  `,')

    render_args = {'blank': style == 'blank', 'solution': style == 'solution'}
    grid_lines = grid.render_grid_html(**render_args)
    print(f'  "grid": `')
    for line in grid_lines:
        print(line)
    print(f'  `,')

    print(f'  "column_count": {grid.column_count},')
    print(f'  "row_count": {grid.row_count}')
    print(f'}}')

def printer_output(grid, style=None, width=None, downs_only=False):
    print_width = width or (92 if not sys.stdout.isatty()
                            else min(grid.term.width, 96))

    clue_lines = ['ACROSS', '']
    clue_lines.extend(['. '.join([str(entry['num']), entry['clue'].strip()])
                       for entry in grid.clues['across']])
    clue_lines.append('')

    if downs_only:
        clue_lines = []

    clue_lines.extend(['DOWN', ''])
    clue_lines.extend(['. '.join([str(entry['num']), entry['clue'].strip()])
                       for entry in grid.clues['down']])

    render_args = {'blank': style == 'blank', 'solution': style == 'solution'}

    grid_lines = [grid.term.strip(l) for l in
                  grid.render_grid(**render_args)]
    grid_lines.append('')

    if print_width < len(grid_lines[0]):
        sys.exit(f'Puzzle is {len(grid_lines[0])} columns wide, '
                 f'cannot be printed at {print_width} columns.')

    print_width = min(print_width, 2 * len(grid_lines[0]))

    print(f'{grid.title} - {grid.author}')
    print()

    current_clue = []
    current_line = ''
    f_width = print_width - len(grid_lines[0]) - 2

    if f_width > 12:
        while grid_lines:
            current_clue = (current_clue or
                            textwrap.wrap(clue_lines.pop(0), f_width) or
                            [''])
            current_line = current_clue.pop(0)
            current_grid_line = grid_lines.pop(0)
            print(f'{current_line:{f_width}.{f_width}}  {current_grid_line}')
    else:
        print('\n'.join(grid_lines))

    remainder = ' '.join(current_clue)
    if remainder:
        clue_lines.insert(0, remainder)

    wrapped_clue_lines = []
    num_cols = 3 if print_width > 64 else 2
    column_width = print_width // num_cols - 2
    for l in clue_lines:
        if len(l) < column_width:
            wrapped_clue_lines.append(l)
        else:
            wrapped_clue_lines.extend(textwrap.wrap(l, width=column_width))

    num_wrapped_rows = math.ceil(len(wrapped_clue_lines)/num_cols)

    for r in range(num_wrapped_rows):
        clue_parts = [wrapped_clue_lines[i] for i in
                      range(r, len(wrapped_clue_lines), num_wrapped_rows)]
        current_row = '  '.join([f'{{:{column_width}}}'] * len(clue_parts))
        print(current_row.format(*clue_parts))
