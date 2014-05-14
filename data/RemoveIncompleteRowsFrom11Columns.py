import xlwt
import xlrd


workbook = xlrd.open_workbook('allUniversityData11Columns.xlsx')
sheet = workbook.sheet_by_index(0)


newworkbook = xlwt.Workbook()
newsheet = newworkbook.add_sheet('sheet1')
current = 0

for index in range(sheet.nrows):
    row = sheet.row(index)
    schoolid = sheet.cell(index, 0).value
    tuition = sheet.cell(index, 2).value
    revenue = sheet.cell(index, 3).value
    fed = sheet.cell(index, 4).value
    state = sheet.cell(index, 5).value
    inst = sheet.cell(index, 6).value
    loan = sheet.cell(index, 7).value
    tuition_02 = sheet.cell(index, 8).value
    #print row
    if tuition == '' or tuition_02 == '' or fed == '' or state == '' or inst == '' or loan == '' or revenue == '':
            print 'skipped ', schoolid
    else:
        for column in range(sheet.ncols):
            newsheet.write(current, column, sheet.cell(index, column).value)

        current = current + 1
        print 'wrote line ', schoolid

    
    

newworkbook.save('output.xlsx')
