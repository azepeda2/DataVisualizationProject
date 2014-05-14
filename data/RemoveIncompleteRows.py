import xlwt
import xlrd


workbook = xlrd.open_workbook('map.xlsx')
sheet = workbook.sheet_by_index(0)


newworkbook = xlwt.Workbook()
newsheet = newworkbook.add_sheet('sheet1')
current = 0

for index in range(sheet.nrows):
    row = sheet.row(index)
    schoolid = sheet.cell(index, 0).value
    tuition = sheet.cell(index, 7).value
    revenue = sheet.cell(index, 8).value
    fed = sheet.cell(index, 14).value
    state = sheet.cell(index, 17).value
    inst = sheet.cell(index, 20).value
    loan = sheet.cell(index, 23).value
    tuition_02 = sheet.cell(index, 25).value
    tuition_03 = sheet.cell(index, 26).value
    #print row
    if tuition == '' or tuition_02 == '' or fed == '' or state == '' or inst == '' or loan == '' or revenue == '':
            print 'skipped ', schoolid
    else:
        if tuition_02 == 0:
            if tuition_03 != '':
                for column in range(sheet.ncols):
                    if(column == 25):
                        newsheet.write(current, 25, tuition_03)
                    else:
                        newsheet.write(current, column, sheet.cell(index, column).value)
                current = current + 1
        for column in range(sheet.ncols):
            newsheet.write(current, column, sheet.cell(index, column).value)

        current = current + 1
        print 'wrote line ', schoolid

    
    

newworkbook.save('output.xlsx')
